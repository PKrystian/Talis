from . import views
from django.urls import path

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'board-games/', views.board_game_list, name='board-game-list'),
    path(API_PREFIX + 'search/', views.search_board_games, name='search_board_games'),
]
