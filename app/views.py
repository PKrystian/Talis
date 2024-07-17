import json
import random

from django.shortcuts import render
from django.http import JsonResponse
from .models.board_game import BoardGame

LIMIT = 16


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
    board_games = BoardGame.objects.all()[:LIMIT]
    data = []

    for board_game in board_games:
        category = json.dumps(board_game.category[BoardGame.CATEGORY_FIELD])

        data.append({
            'id': board_game.id,
            'name': board_game.name,
            'year_published': board_game.year_published,
            'publisher': board_game.publisher,
            'category': category,
            'expansions': board_game.expansion,
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
