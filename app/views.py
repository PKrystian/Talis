from django.shortcuts import render
from django.http import JsonResponse
from urllib.parse import parse_qs
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET

from .controllers.BoardGameController import BoardGameController
from .controllers.CollectionController import CollectionController
from .controllers.FriendListController import FriendListController
from .controllers.UserController import UserController
from .controllers.SearchController import SearchController
from .controllers.EventController import EventController
from .controllers.UserProfileController import UserProfileController


def index(request) -> None:
    return render(request, 'index.html')


@ensure_csrf_cookie
def set_session(request) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({'is_authenticated': False})
    return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            })


@csrf_exempt
def board_game_list(request) -> JsonResponse:
    board_game_controller = BoardGameController()

    return board_game_controller.action_board_game_list(request)


@require_GET
def board_game_details(request, game_id) -> JsonResponse:
    board_game_controller = BoardGameController()

    return board_game_controller.action_board_game_detail(request, game_id)


@require_GET
def search(request) -> JsonResponse:
    search_controller = SearchController()

    query = request.GET.get('query', '')
    limit = int(request.GET.get('limit', search_controller.MEDIUM_LIMIT))
    query_params = parse_qs(request.META['QUERY_STRING'])

    return search_controller.action_search_board_games(query, limit, query_params)


@require_POST
@csrf_exempt
def login(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.action_login(request)

    return response


@require_POST
@csrf_exempt
def logout(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.action_logout(request)

    return response


@require_POST
@csrf_exempt
def register(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.action_register(request)

    return response


def check_auth(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.check_auth(request)

    return response


def check_cookie_consent(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.check_cookie_consent(request)

    return response

@require_POST
@csrf_exempt
def change_cookie_consent(request) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.change_cookie_consent(request)

    return response

@require_POST
@csrf_exempt
def add_to_collection(request) -> JsonResponse:
    collection_controller = CollectionController()
    response = collection_controller.action_add_to_collection(request)

    return response


@require_POST
@csrf_exempt
def remove_from_collection(request) -> JsonResponse:
    collection_controller = CollectionController()
    response = collection_controller.action_remove_from_collection(request)

    return response


@require_POST
@csrf_exempt
def user_collection(request) -> JsonResponse:
    collection_controller = CollectionController()
    response = collection_controller.action_user_collection(request)

    return response

@require_GET
def get_events(request) -> JsonResponse:
    event_controller = EventController()
    response = event_controller.action_get_events()

    return response


@require_POST
@csrf_exempt
def new_event(request) -> JsonResponse:
    event_controller = EventController()
    response = event_controller.action_new_event(request)

    return response

@require_GET
def user_profile_detail(request, user_id) -> JsonResponse:
    user_profile_controller = UserProfileController()

    return user_profile_controller.action_user_profile_detail(request, user_id)

@require_GET
@csrf_exempt
def friend_list_detail(request) -> JsonResponse:
    user_id = request.GET.get('user_id')
    limit = int(request.GET.get('limit', 10))
    tags = request.GET.get('tags', None)

    friend_list_controller = FriendListController()
    response = friend_list_controller.action_friend_list(request, user_id, limit, tags)

    return response

@require_POST
@csrf_exempt
def add_friend(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_add_friend(request)

    return response

@require_POST
@csrf_exempt
def accept_friend(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_accept_friend(request)

    return response

@require_POST
@csrf_exempt
def reject_friend(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_reject_friend(request)

    return response

@require_POST
@csrf_exempt
def remove_friend(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_remove_friend(request)

    return response

@require_GET
@csrf_exempt
def pending_invites(request) -> JsonResponse:
    user_id = request.GET.get('user_id')
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_pending_invites(request, user_id)

    return response

@require_POST
@csrf_exempt
def friend_status(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_friend_status(request)

    return response

@require_POST
@csrf_exempt
def get_friends_with_game(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    game_id = request.POST.get('game_id')
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_get_friends_with_game(request, user_id, game_id)

    return response

@require_POST
@csrf_exempt
def get_friends_for_user(request) -> JsonResponse:
    friend_list_controller = FriendListController()
    response = friend_list_controller.action_get_friends_for_user(request)

    return response
