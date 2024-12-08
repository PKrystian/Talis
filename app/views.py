import json

from django.shortcuts import render
from django.http import JsonResponse
from urllib.parse import parse_qs
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET

from .controllers.BoardGameController import BoardGameController
from .controllers.CategoryController import CategoryController
from .controllers.CollectionController import CollectionController
from .controllers.FriendListController import FriendListController
from .controllers.InviteController import InviteController
from .controllers.UserController import UserController
from .controllers.SearchController import SearchController
from .controllers.EventController import EventController
from .controllers.UserProfileController import UserProfileController
from .controllers.CommentsRatingsController import CommentsRatingsController
from .utils.EventFilter import EventFilter


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


@require_POST
@csrf_exempt
def board_game_list(request) -> JsonResponse:
    user_id = request.POST.get('user_id')

    board_game_controller = BoardGameController()

    return board_game_controller.action_board_game_list(user_id)


@require_GET
def board_game_details(request, game_id) -> JsonResponse:
    board_game_controller = BoardGameController()

    return board_game_controller.action_board_game_detail(game_id)


@require_GET
def search(request) -> JsonResponse:
    search_controller = SearchController()

    query = request.GET.get('query', '')
    limit = int(request.GET.get('limit', search_controller.MEDIUM_LIMIT))
    page = int(request.GET.get('page', 1))
    query_params = parse_qs(request.META['QUERY_STRING'])

    return search_controller.action_search_board_games(query, limit, page, query_params)


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
    user_id = request.POST.get('user_id', None)
    user_decision = request.POST.get('cookie_consent')

    user_controller = UserController()
    response = user_controller.change_cookie_consent(user_id, user_decision)

    return response


@require_POST
@csrf_exempt
def check_email(request) -> JsonResponse:
    user_controller = UserController()

    email = request.POST.get('email')

    response = user_controller.action_check_email(email)

    return response


@require_GET
@csrf_exempt
def check_access_password_change(request, token) -> JsonResponse:
    user_controller = UserController()

    response = user_controller.action_check_access_password_change(token)

    return response


@require_POST
@csrf_exempt
def change_password(request) -> JsonResponse:
    user_controller = UserController()

    token = request.POST.get('token')
    new_password = request.POST.get('password')

    response = user_controller.action_change_password(token, new_password)

    return response


@require_GET
@csrf_exempt
def verify_account(request, token) -> JsonResponse:
    user_controller = UserController()

    response = user_controller.action_verify_account(token)

    return response


@require_POST
@csrf_exempt
def add_to_collection(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    board_game_id = request.POST.get('board_game_id')
    status = request.POST.get('status')

    collection_controller = CollectionController()

    response = collection_controller.action_add_to_collection(user_id, board_game_id, status)

    return response


@require_POST
@csrf_exempt
def remove_from_collection(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    board_game_id = request.POST.get('board_game_id')
    status = request.POST.get('status')

    collection_controller = CollectionController()

    response = collection_controller.action_remove_from_collection(user_id, board_game_id, status)

    return response


@require_POST
@csrf_exempt
def user_collection(request) -> JsonResponse:
    user_id = request.POST.get('user_id')

    collection_controller = CollectionController()

    response = collection_controller.action_user_collection(user_id)

    return response

@require_GET
def get_events(request) -> JsonResponse:
    event_controller = EventController()
    response = event_controller.action_get_events()

    return response


@require_POST
@csrf_exempt
def get_user_reliant_events(request):
    user_id = request.POST.get('user_id')

    event_controller = EventController()

    response = event_controller.action_get_user_reliant_events(user_id)

    return response


@require_POST
@csrf_exempt
def new_event(request) -> JsonResponse:
    event_form_data = request.POST

    event_controller = EventController()

    response = event_controller.action_new_event(event_form_data)

    return response

@require_GET
def get_filtered_events(request) -> JsonResponse:
    user_id = request.GET.get('user_id')

    filters = dict()

    filters[EventFilter.EVENT_FILTER_STARTING_FROM] = request.GET.get(EventFilter.EVENT_FILTER_STARTING_FROM)
    filters[EventFilter.EVENT_FILTER_PLAYER_NUMBER_MIN] = request.GET.get(EventFilter.EVENT_FILTER_PLAYER_NUMBER_MIN)
    filters[EventFilter.EVENT_FILTER_PLAYER_NUMBER_MAX] = request.GET.get(EventFilter.EVENT_FILTER_PLAYER_NUMBER_MAX)
    filters[EventFilter.EVENT_FILTER_CREATED_BY_FRIENDS] = request.GET.get(EventFilter.EVENT_FILTER_CREATED_BY_FRIENDS)
    filters[EventFilter.EVENT_FILTER_CATEGORIES] = json.loads(request.GET.get(EventFilter.EVENT_FILTER_CATEGORIES))

    event_controller = EventController()
    response = event_controller.action_get_filtered_events(user_id, filters)

    return response


@require_GET
def get_one_event(request, event_id) -> JsonResponse:
    event_controller = EventController()
    response = event_controller.action_get_one_event(event_id)

    return response

@require_POST
@csrf_exempt
def remove_event(request) -> JsonResponse:
    event_id = request.POST.get('event_id')

    event_controller = EventController()

    response = event_controller.action_remove_event(event_id)

    return response


@require_GET
def user_profile_detail(request, user_id) -> JsonResponse:
    user_controller = UserController()
    response = user_controller.action_user_profile_detail(user_id)

    return response


@require_GET
@csrf_exempt
def friend_list_detail(request) -> JsonResponse:
    user_id = request.GET.get('user_id')
    limit = int(request.GET.get('limit', 10))
    tags = request.GET.get('tags', None)

    friend_list_controller = FriendListController()
    response = friend_list_controller.action_friend_list(user_id, limit, tags)

    return response


@require_POST
@csrf_exempt
def add_friend(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    friend_id = request.POST.get('friend_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_add_friend(user_id, friend_id)

    return response


@require_POST
@csrf_exempt
def accept_friend(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    friend_id = request.POST.get('friend_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_accept_friend(user_id, friend_id)

    return response


@require_POST
@csrf_exempt
def reject_friend(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    friend_id = request.POST.get('friend_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_reject_friend(user_id, friend_id)

    return response


@require_POST
@csrf_exempt
def remove_friend(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    friend_id = request.POST.get('friend_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_remove_friend(user_id, friend_id)

    return response


@require_GET
@csrf_exempt
def pending_invites(request) -> JsonResponse:
    user_id = request.GET.get('user_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_pending_invites(user_id)

    return response


@require_POST
@csrf_exempt
def friend_status(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    friend_id = request.POST.get('friend_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_friend_status(user_id, friend_id)

    return response


@require_POST
@csrf_exempt
def get_friends_with_game(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    game_id = request.POST.get('game_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_get_friends_with_game(user_id, game_id)

    return response


@require_POST
@csrf_exempt
def get_friends_for_user(request) -> JsonResponse:
    user_id = request.POST.get('user_id')

    friend_list_controller = FriendListController()

    response = friend_list_controller.action_get_friends_for_user(user_id)

    return response


@require_POST
@csrf_exempt
def get_invites_for_user(request) -> JsonResponse:
    user_id = request.POST.get('user_id')

    invite_controller = InviteController()

    response = invite_controller.action_get_invites(user_id)

    return response


@require_POST
@csrf_exempt
def ask_to_join_event(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    event_id = request.POST.get('event_id')

    event_controller = EventController()

    response = event_controller.action_ask_to_join_event(user_id, event_id)

    return response


@require_POST
@csrf_exempt
def get_join_requests(request) -> JsonResponse:
    user_id = request.POST.get('user_id')

    invite_controller = InviteController()

    response = invite_controller.action_get_join_requests(user_id)

    return response


@require_POST
@csrf_exempt
def accept_or_reject_invite(request) -> JsonResponse:
    invite_id = request.POST.get('invite_id')
    choice = request.POST.get('choice')

    invite_controller = InviteController()

    response = invite_controller.action_accept_or_reject_invite(invite_id, choice)

    return response

@require_POST
@csrf_exempt
def update_user(request) -> JsonResponse:
    user_id = request.POST.get('user_id')
    updated_user_data = request.POST.dict()

    user_controller = UserController()

    response = user_controller.action_update_user(user_id, updated_user_data)

    return response

@require_POST
@csrf_exempt
def game_add(request) -> JsonResponse:
    game_add_data = request.POST.dict()

    game_add_controller = BoardGameController()

    response = game_add_controller.action_add_game(game_add_data)

    return response

@require_GET
def get_all_game_categories(request) -> JsonResponse:
    category_controller = CategoryController()
    response = category_controller.action_get_all_game_categories()

    return response


def custom_404_view(request, exception):
    return render(request, '404.html', status=404)

@require_POST
@csrf_exempt
def add_comment(request) -> JsonResponse:
    user_id = int(request.POST.get('user_id'))
    board_game_id = int(request.POST.get('board_game_id'))
    comment_str = request.POST.get('comment')
    rating_fl = request.POST.get('rating')

    comments_controller = CommentsRatingsController()

    response = comments_controller.action_add_comment(user_id, board_game_id, comment_str, rating_fl)

    return response

@require_POST
@csrf_exempt
def get_comments(request) -> JsonResponse:
    board_game_id = int(request.POST.get('board_game_id'))

    comments_controller = CommentsRatingsController()

    response = comments_controller.action_get_comments(board_game_id)

    return response

@require_POST
@csrf_exempt
def update_comment(request) -> JsonResponse:
    comment_id = int(request.POST.get('comment_id'))
    comment_str = request.POST.get('comment')
    rating_fl = request.POST.get('rating')

    comments_controller = CommentsRatingsController()

    response = comments_controller.action_update_comment(comment_id, comment_str, rating_fl)

    return response

@require_POST
@csrf_exempt
def delete_comment(request) -> JsonResponse:
    comment_id = int(request.POST.get('comment_id'))

    comments_controller = CommentsRatingsController()

    response = comments_controller.action_delete_comment(comment_id)

    return response

@require_POST
@csrf_exempt
def get_user_ratings_calculated(request) -> JsonResponse:
    board_game_id = int(request.POST.get('board_game_id'))

    comments_controller = CommentsRatingsController()

    response = comments_controller.action_get_user_ratings_calculated(board_game_id)

    return response