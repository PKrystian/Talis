from . import views
from django.urls import path

from .controllers.CategoryController import CategoryController
from .controllers.InviteController import InviteController
from .controllers.SettingsController import SettingsController
from .utils import SitemapsHelper
from .utils.sitemaps import MainSitemap, sitemap_index

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
    path(API_PREFIX + UserController.ROUTE_CHECK_EMAIL, views.check_email, name='check-email'),
    path(API_PREFIX + UserController.ROUTE_CHECK_ACCESS_PASSWORD_CHANGE, views.check_access_password_change, name='check-access-password-change'),
    path(API_PREFIX + UserController.ROUTE_CHANGE_PASSWORD, views.change_password, name='change-password'),
    path(API_PREFIX + UserController.ROUTE_VERIFY_ACCOUNT, views.verify_account, name='verify-account'),
    path(API_PREFIX + SearchController.ROUTE, views.search, name='action_search_board_games'),
    path(API_PREFIX + CollectionController.ROUTE_ADD, views.add_to_collection, name='add_to_collection'),
    path(API_PREFIX + CollectionController.ROUTE_REMOVE, views.remove_from_collection, name='remove_from_collection'),
    path(API_PREFIX + CollectionController.ROUTE, views.user_collection, name='user-collection'),
    path(API_PREFIX + EventController.ROUTE_GET, views.get_events, name='get-events'),
    path(API_PREFIX + EventController.ROUTE_GET_ONE, views.get_one_event, name='get-one-event'),
    path(API_PREFIX + EventController.ROUTE_NEW, views.new_event, name='new-event'),
    path(API_PREFIX + EventController.ROUTE_JOIN, views.ask_to_join_event, name='ask-to-join-event'),
    path(API_PREFIX + EventController.ROUTE_USER_RELIANT_EVENTS, views.get_user_reliant_events, name='user-reliant-events'),
    path(API_PREFIX + EventController.ROUTE_GET_FILTERED, views.get_filtered_events, name='get-filtered-events'),
    path(API_PREFIX + EventController.ROUTE_REMOVE_EVENT, views.remove_event, name='remove-event'),
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
    path(API_PREFIX + InviteController.ROUTE_GET, views.get_invites_for_user, name='get-invites'),
    path(API_PREFIX + InviteController.ROUTE_GET_JOIN_REQUESTS, views.get_join_requests, name='get-join-requests'),
    path(API_PREFIX + InviteController.ROUTE_ACCEPT_REJECT_INVITE, views.accept_or_reject_invite, name='accept_reject_invite'),
    path(API_PREFIX + SettingsController.ROUTE_DETAIL, views.update_user, name='update-user'),
    path(API_PREFIX + CategoryController.ROUTE_GET_ALL, views.get_all_game_categories, name='get-all-game-categories'),
    path('sitemap.xml', sitemap_index, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-boardgames-<int:offset>.xml', SitemapsHelper.board_game_sitemap_view, name='board-game-sitemap'),
]
