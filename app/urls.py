from . import views
from django.urls import path

from .controllers.RegistrationController import RegistrationController

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'board-games/', views.board_game_list, name='board-game-list'),
    path(API_PREFIX + 'set-cookies/', views.set_cookies, name='cookies'),
    path(API_PREFIX + RegistrationController.ROUTE, views.register, name='register'),
]
