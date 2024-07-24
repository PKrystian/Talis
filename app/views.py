from django.db.models import Q
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from .controllers.RegistrationController import RegistrationController
from .models import BoardGame
import random
from urllib.parse import parse_qs

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
        'boardgamepublisher_set__publisher',
        'boardgamecategory_set__category',
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
    try:
        query = request.GET.get('query', '')
        limit = int(request.GET.get('limit', MEDIUM_LIMIT))

        query_params = parse_qs(request.META['QUERY_STRING'])
        combined_filters = query_params.get('filters[]', [])

        board_games = BoardGame.objects.exclude(rating__isnull=True)

        if query:
            board_games = board_games.filter(name__icontains=query)

        for combined_filter in combined_filters:
            if 'players|' in combined_filter:
                min_players, max_players = combined_filter.replace('players|', '').split('-')
                min_players = int(min_players) if min_players else None
                max_players = int(max_players) if max_players else None
                if min_players and max_players:
                    board_games = board_games.filter(min_players__lte=min_players, max_players__gte=max_players)
                elif min_players:
                    board_games = board_games.filter(max_players__gte=min_players)
                elif max_players:
                    board_games = board_games.filter(min_players__lte=max_players)
            else:
                filter_type, filter_value = combined_filter.split('|', 1)
                filter_type_to_field = {
                    'category': 'boardgamecategory__category__name__icontains',
                    'mechanic': 'boardgamemechanic__mechanic__name__icontains',
                    'age': 'age',
                    'playtime': 'min_playtime',
                }
                if filter_type == 'age':
                    age_ranges = {
                        'up to 3 years': (None, 3),
                        '3-4 years': (3, 4),
                        '5-7 years': (5, 7),
                        '8-11 years': (8, 11),
                        '12-14 years': (12, 14),
                        '15-17 years': (15, 17),
                        '18+ years': (18, None),
                    }
                    age_min, age_max = age_ranges.get(filter_value, (0, None))
                    if age_min and age_max:
                        board_games = board_games.filter(age__gte=age_min, age__lte=age_max)
                    elif age_min:
                        board_games = board_games.filter(age__gte=age_min)
                    elif age_max:
                        board_games = board_games.filter(age__lte=age_max)
                elif filter_type == 'playtime':
                    playtime_ranges = {
                        '< 15 min': (None, 15),
                        '< 30 min': (None, 30),
                        '< 1h': (None, 60),
                        '< 2h': (None, 120),
                        '2h+': (120, None),
                    }
                    min_playtime, max_playtime = playtime_ranges.get(filter_value, (0, None))
                    if min_playtime:
                        board_games = board_games.filter(min_playtime__gte=min_playtime)
                    elif max_playtime:
                        board_games = board_games.filter(max_playtime__lte=max_playtime)
                else:
                    field_path = filter_type_to_field.get(filter_type.lower())
                    if field_path:
                        q_object = Q(**{field_path: filter_value})
                        board_games = board_games.filter(q_object)

        board_games = board_games.order_by('-rating')[:limit]

        data = [{
            'id': game.id,
            'name': game.name,
            'year_published': game.year_published,
            'publisher': ', '.join([bp.publisher.name for bp in game.boardgamepublisher_set.all()]),
            'category': ', '.join([bc.category.name for bc in game.boardgamecategory_set.all()]),
            'expansions': [{'expansion_id': expansion.expansion_board_game.id,
                            'expansion_name': expansion.expansion_board_game.name} for expansion in
                           game.expansions.all()],
            'min_players': game.min_players,
            'max_players': game.max_players,
            'age': game.age,
            'min_playtime': game.min_playtime,
            'max_playtime': game.max_playtime,
            'image_url': game.image_url,
        } for game in board_games]

        return JsonResponse({'results': data}, safe=False)
    except ValueError:
        return JsonResponse({'error': 'Invalid query parameters'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
