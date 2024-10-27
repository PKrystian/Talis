from . import views
from django.urls import path
from django.contrib.sitemaps.views import sitemap

from .utils import SitemapsHelper
from .utils.sitemaps import BoardGameSitemap, MainSitemap

from .controllers.BoardGameController import BoardGameController
from .controllers.FriendListController import FriendListController
from .controllers.UserController import UserController
from .controllers.SearchController import SearchController
from .controllers.CollectionController import CollectionController
from .controllers.EventController import EventController
from .controllers.UserProfileController import UserProfileController

sitemaps = {
    'boardgames': MainSitemap,
}

API_PREFIX = 'api/'

urlpatterns = [
    path('', views.index, name='index'),
    path(API_PREFIX + 'session/', views.set_session, name='session'),
    path(API_PREFIX + BoardGameController.ROUTE, views.board_game_list, name='board-game-list'),
    path(API_PREFIX + BoardGameController.ROUTE_GAME_DETAIL, views.board_game_details, name='board-game-detail'),
    path(API_PREFIX + UserController.ROUTE_LOGIN, views.login, name='login'),
    path(API_PREFIX + UserController.ROUTE_LOGOUT, views.logout, name='logout'),
    path(API_PREFIX + UserController.ROUTE_REGISTER, views.register, name='register'),
    path(API_PREFIX + UserController.ROUTE_CHECK_AUTH, views.check_auth, name='check-auth'),
    path(API_PREFIX + UserController.ROUTE_CHECK_COOKIE_CONSENT, views.check_cookie_consent, name='check-cookie-consent'),
    path(API_PREFIX + UserController.ROUTE_CHANGE_COOKIE_CONSENT, views.change_cookie_consent, name='change-cookie-consent'),
    path(API_PREFIX + SearchController.ROUTE, views.search, name='action_search_board_games'),
    path(API_PREFIX + CollectionController.ROUTE_ADD, views.add_to_collection, name='add_to_collection'),
    path(API_PREFIX + CollectionController.ROUTE_REMOVE, views.remove_from_collection, name='remove_from_collection'),
    path(API_PREFIX + CollectionController.ROUTE, views.user_collection, name='user-collection'),
    path(API_PREFIX + EventController.ROUTE_GET, views.get_events, name='get-events'),
    path(API_PREFIX + EventController.ROUTE_NEW, views.new_event, name='new-event'),
    path(API_PREFIX + UserProfileController.ROUTE_DETAIL, views.user_profile_detail, name='user-profile-detail'),
    path(API_PREFIX + FriendListController.ROUTE_DETAIL, views.friend_list_detail, name='friend-list-detail'),
    path(API_PREFIX + FriendListController.ROUTE_ADD, views.add_friend, name='add-friend'),
    path(API_PREFIX + FriendListController.ROUTE_ACCEPT, views.accept_friend, name='accept-friend'),
    path(API_PREFIX + FriendListController.ROUTE_REJECT, views.reject_friend, name='reject-friend'),
    path(API_PREFIX + FriendListController.ROUTE_REMOVE, views.remove_friend, name='remove-friend'),
    path(API_PREFIX + FriendListController.ROUTE_INVITES, views.pending_invites, name='pending-invites'),
    path(API_PREFIX + FriendListController.ROUTE_STATUS, views.friend_status, name='friend-status'),
    path(API_PREFIX + FriendListController.ROUTE_WITH_GAME, views.get_friends_with_game, name='friends-with-game'),
    path(API_PREFIX + FriendListController.ROUTE_GET_ALL, views.get_friends_for_user, name='friends-for-user'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-boardgames-<int:offset>.xml', SitemapsHelper.board_game_sitemap_view, name='board-game-sitemap'),
]
