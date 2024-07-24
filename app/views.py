import random

from django.db.models import Prefetch
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt, csrf_protect, requires_csrf_token

from .controllers.RegistrationController import RegistrationController
from django.http import JsonResponse
from .models import BoardGameCategory, BoardGamePublisher
from .models.board_game import BoardGame
from django.db.models import Count, Q
from functools import reduce

BIG_LIMIT = 48
MEDIUM_LIMIT = 18
SMALL_LIMIT = 5


def index(request) -> None:
    return render(request, 'index.html')


def get_shuffled_games(board_games) -> list:
    board_games_list = list(board_games)
    random.shuffle(board_games_list)
    return board_games_list


def categorize_games(board_games) -> dict:
    categories = [
        'Based on your games',
        'Wishlist',
        'On top recently',
        'Best for a party',
        'Best ice breaker',
    ]

    categorized_games = {category: get_shuffled_games(board_games) for category in categories}
    return categorized_games


def board_game_list(request) -> JsonResponse:
    board_games = BoardGame.objects.exclude(rating__isnull=True).prefetch_related(
        Prefetch('boardgamepublisher_set', queryset=BoardGamePublisher.objects.select_related('publisher')),
        Prefetch('boardgamecategory_set', queryset=BoardGameCategory.objects.select_related('category')),
        'expansions__expansion_board_game'
    ).order_by('-rating')[:MEDIUM_LIMIT]

    data = []

    for board_game in board_games:
        publishers = ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()])
        categories = ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()])
        expansions = [{
            'expansion_id': expansion.expansion_board_game.id,
            'expansion_name': expansion.expansion_board_game.name
        } for expansion in board_game.expansions.all()]

        data.append({
            'id': board_game.id,
            'name': board_game.name,
            'year_published': board_game.year_published,
            'publisher': publishers,
            'category': categories,
            'expansions': expansions,
            'min_players': board_game.min_players,
            'max_players': board_game.max_players,
            'age': board_game.age,
            'min_playtime': board_game.min_playtime,
            'max_playtime': board_game.max_playtime,
            'image_url': board_game.image_url,
        })

    categorized_data = categorize_games(data)

    return JsonResponse(categorized_data, safe=False)


@ensure_csrf_cookie
def set_cookies(request):
    return JsonResponse({'detail': 'Cookies set'})


@csrf_exempt
def register(request):
    response = HttpResponse('Wrong request')
    response.status_code = 400

    if request.method == 'POST' and request.POST:
        registration_controller = RegistrationController()
        response = registration_controller.action_register(request.POST)

    return response

def search_board_games(request):
    query = request.GET.get('query', '')
    limit = int(request.GET.get('limit', SMALL_LIMIT))
    filter_type = request.GET.get('filterType', '')
    filter_names = [fn.strip() for fn in request.GET.get('filter', '').split(',') if fn.strip()]
    print(filter_names)
    print(filter_type)

    board_games = BoardGame.objects.exclude(rating__isnull=True)

    if query:
        board_games = board_games.filter(name__icontains=query)

    if filter_type == 'Category' and filter_names:
        q_objects = [Q(boardgamecategory__category__name__icontains=fn) for fn in filter_names]
        board_games = board_games.annotate(match_count=Count('boardgamecategory', filter=reduce(Q.__or__, q_objects), distinct=True)).filter(match_count=len(filter_names))
    if filter_type == 'Publisher' and filter_names:
        q_objects = [Q(boardgamepublisher__publisher__name__icontains=fn) for fn in filter_names]
        board_games = board_games.annotate(match_count=Count('boardgamepublisher', filter=reduce(Q.__or__, q_objects), distinct=True)).filter(match_count=len(filter_names))
    if filter_type == 'Mechanic' and filter_names:
        q_objects = [Q(boardgamepublisher__mechanic__name__icontains=fn) for fn in filter_names]
        board_games = board_games.annotate(match_count=Count('boardgamemechanic', filter=reduce(Q.__or__, q_objects), distinct=True)).filter(match_count=len(filter_names))

    board_games = board_games.order_by('-rating')[:limit]

    data = []

    for board_game in board_games:
        publishers = ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()])
        categories = ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()])
        expansions = [{
            'expansion_id': expansion.expansion_board_game.id,
            'expansion_name': expansion.expansion_board_game.name
        } for expansion in board_game.expansions.all()]

        data.append({
            'id': board_game.id,
            'name': board_game.name,
            'year_published': board_game.year_published,
            'publisher': publishers,
            'category': categories,
            'expansions': expansions,
            'min_players': board_game.min_players,
            'max_players': board_game.max_players,
            'age': board_game.age,
            'min_playtime': board_game.min_playtime,
            'max_playtime': board_game.max_playtime,
            'image_url': board_game.image_url,
        })

    return JsonResponse({'results': data}, safe=False)
