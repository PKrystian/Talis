from django.shortcuts import render
from django.http import JsonResponse
from .models.board_game import BoardGame


def index(request):
    return render(request, 'index.html')


def board_game_list(request):
    board_games = BoardGame.objects.all()
    data = [
        {
            'id': board_game.id,
            'name': board_game.name,
            'year_published': board_game.year_published,
            'age': board_game.description
        }
        for board_game in board_games
    ]

    return JsonResponse(data, safe=False)
