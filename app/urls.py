from . import views
from django.urls import path

from .controllers.BoardGameController import BoardGameController
from .controllers.UserController import UserController
from .controllers.SearchController import SearchController

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'session/', views.set_session, name='session'),
    path(API_PREFIX + BoardGameController.ROUTE, views.board_game_list, name='board-game-list'),
    path(API_PREFIX + UserController.ROUTE, views.register, name='register'),
    path(API_PREFIX + SearchController.ROUTE, views.search, name='action_search_board_games'),
]
