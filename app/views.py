from django.shortcuts import render
from django.http import JsonResponse
from .models.board_game import BoardGame
import json
import random

LIMIT = 10


def index(request):
    return render(request, 'index.html')


def get_shuffled_games(board_games):
    board_games_list = list(board_games)
    random.shuffle(board_games_list)
    return board_games_list


def categorize_games(board_games):
    categories = [
        'Based on your games',
        'Wishlist',
        'On top recently',
        'Best for a party',
        'Best ice breaker',
    ]

    categorized_games = {category: get_shuffled_games(board_games) for category in categories}
    return categorized_games


def parse_json_data(json_str):
    try:
        if json_str.strip():
            categories = json.loads(json_str.replace("'", '"'))
            return ', '.join(categories)
        else:
            return ''
    except (json.JSONDecodeError, TypeError):
        print(f"Error decoding JSON data: {json_str}")
        return ''


def board_game_list(request):
    board_games = BoardGame.objects.all()[:LIMIT]
    data = []

    for board_game in board_games:
        category = parse_json_data(board_game.category)

        data.append({
            'id': board_game.id,
            'name': board_game.name,
            'year_published': board_game.year_published,
            'publisher': board_game.publisher,
            'category': category,
            'min_players': board_game.min_players,
            'max_players': board_game.max_players,
            'age': board_game.age,
            'min_playtime': board_game.min_playtime,
            'max_playtime': board_game.max_playtime,
            'image_url': board_game.image_url,
        })

    categorized_data = categorize_games(data)

    return JsonResponse(categorized_data, safe=False)
