from . import views
from django.urls import path, re_path
from django.views.generic import TemplateView

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'board-games/', views.board_game_list, name='board-game-list'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
