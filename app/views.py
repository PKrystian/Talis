from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST
import random

from .controllers.UserController import UserController
from .models import BoardGame

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
            'description': board_game.description,
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
def set_session(request) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({'is_authenticated': False})
    return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            })


@require_POST
@csrf_exempt
def register(request) -> JsonResponse:
    registration_controller = UserController()
    response = registration_controller.action_register(request)

    return response
