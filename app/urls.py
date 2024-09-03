from . import views
from django.urls import path

from .controllers.BoardGameController import BoardGameController
from .controllers.UserController import UserController
from .controllers.SearchController import SearchController
from .controllers.CollectionController import CollectionController

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'session/', views.set_session, name='session'),
    path(API_PREFIX + BoardGameController.ROUTE, views.board_game_list, name='board-game-list'),
    path(API_PREFIX + BoardGameController.ROUTE_GAME_DETAIL, views.board_game_details, name='board-game-detail'),
    path(API_PREFIX + UserController.ROUTE_LOGIN, views.login, name='login'),
    path(API_PREFIX + UserController.ROUTE_REGISTER, views.register, name='register'),
    path(API_PREFIX + SearchController.ROUTE, views.search, name='action_search_board_games'),
    path(API_PREFIX + CollectionController.ROUTE_ADD, views.add_to_collection, name='add_to_collection'),
    path(API_PREFIX + CollectionController.ROUTE_REMOVE, views.remove_from_collection, name='remove_from_collection'),
    path(API_PREFIX + CollectionController.ROUTE, views.user_collection, name='user-collection'),
]
