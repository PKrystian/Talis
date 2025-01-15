from app.models import UserBoardGameCollection
from app.models.friend_list import FriendList
from django.http import JsonResponse
from django.contrib.auth.models import User

from app.models.invite import Invite


class FriendListController:
    ROUTE_DETAIL: str = 'friends/'

    @staticmethod
    def action_friend_list(user_id: int, limit: int, tags: list | None) -> JsonResponse:
        friend_query = FriendList.objects.filter(user_id=user_id)
        print(friend_query)

        if tags:
            friend_query = friend_query.filter(status=tags)

        friend_list = friend_query.order_by('-created_at')[:limit]

        data = []

        for friend in friend_list:
            data.append({
                'id': friend.friend.id,
                'username': friend.friend.username,
                'first_name': friend.friend.first_name,
                'last_name': friend.friend.last_name,
                'profile_image_url': friend.friend.registereduser.profile_image_url,
            })

        return JsonResponse(data, safe=False)

    ROUTE_ADD: str = 'add-friend/'

    @staticmethod
    def action_add_friend(user_id: int, friend_id: int) -> JsonResponse:
        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)
        if user_id == friend_id:
            return JsonResponse({'error': 'Cannot add yourself to friends.'}, status=400)
        if not User.objects.filter(id=friend_id).exists():
            return JsonResponse({'error': 'User doesn\'t exist.'}, status=400)

        friend_list = FriendList.objects.filter(
            user_id=user_id,
            friend_id=friend_id,
            status__in=[FriendList.STATUS_PENDING, FriendList.STATUS_ACCEPTED]
        ).order_by('-created_at').first()

        if friend_list:
            return JsonResponse({'error': 'Already friends or request pending.'}, status=400)

        FriendList.objects.create(user_id=user_id, friend_id=friend_id, status=FriendList.STATUS_PENDING)
        Invite.objects.create(user_id=user_id, invited_user_id=friend_id, type=Invite.INVITE_TYPE_NEW_FRIEND_REQUEST, status=Invite.INVITE_STATUS_PENDING)

        return JsonResponse({'success': True})

    ROUTE_ACCEPT: str = 'accept-friend/'

    def action_accept_friend(self, user_id: int, friend_id: int) -> JsonResponse:
        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()
        if not friend_list:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        friend_list.status = FriendList.STATUS_ACCEPTED
        friend_list.save()

        self.__dismiss_invites(user_id, friend_id)

        return JsonResponse({'success': True})

    ROUTE_REJECT: str = 'reject_friend/'

    def action_reject_friend(self, user_id: int, friend_id: int) -> JsonResponse:
        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()
        if not friend_list:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        friend_list.status = FriendList.STATUS_REJECTED
        friend_list.save()

        self.__dismiss_invites(user_id, friend_id)

        return JsonResponse({'success': True})

    ROUTE_REMOVE: str = 'remove_friend/'

    @staticmethod
    def action_remove_friend(user_id: int, friend_id: int) -> JsonResponse:
        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=user_id, friend_id=friend_id).order_by('-created_at').first()

        if not friend_list:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        if friend_list:
            friend_list.status = FriendList.STATUS_REMOVED
            friend_list.save()

        return JsonResponse({'success': True})

    ROUTE_INVITES: str = 'friend-invites/'

    @staticmethod
    def action_pending_invites(user_id) -> JsonResponse:
        pending_invites = FriendList.objects.filter(friend_id=user_id, status=FriendList.STATUS_PENDING)
        data = []

        for invite in pending_invites:
            data.append({
                'id': invite.user.id,
                'username': invite.user.username,
                'first_name': invite.user.first_name,
                'last_name': invite.user.last_name,
                'profile_image_url': invite.user.registereduser.profile_image_url,
            })

        return JsonResponse(data, safe=False)

    ROUTE_STATUS: str = 'friend_status/'

    @staticmethod
    def action_friend_status(user_id: int, friend_id: int) -> JsonResponse:
        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=user_id, friend_id=friend_id).order_by('-created_at').first()

        if friend_list:
            return JsonResponse({'status': friend_list.status})
        else:
            return JsonResponse({'status': 'not_friends'})

    ROUTE_WITH_GAME: str = 'friends_with_game/'

    @staticmethod
    def action_get_friends_with_game(user_id, game_id):
        friend_list_ids = FriendList.objects.filter(
            user_id__exact=user_id,
            status__exact=FriendList.STATUS_ACCEPTED
        ).order_by('-created_at').values_list('friend_id', flat=True)

        friends_with_game = UserBoardGameCollection.objects.filter(
            user_id__in=friend_list_ids,
            board_game_id=game_id,
            status__in=['wishlist', 'library']
        ).select_related('user').distinct()

        data = [
            {
                'id': collection.user.id,
                'first_name': collection.user.first_name,
                'last_name': collection.user.last_name,
                'profile_image_url': collection.user.registereduser.profile_image_url,
                'status': collection.status
            }
            for collection in friends_with_game
        ]

        return JsonResponse(data, safe=False)

    ROUTE_GET_ALL = 'get_friends/'

    @staticmethod
    def action_get_friends_for_user(user_id: int) -> JsonResponse:
        data = []

        if FriendList.objects.filter(user_id__exact=user_id).exists():
            friends = FriendList.objects.filter(user_id=user_id, status=FriendList.STATUS_ACCEPTED).order_by('-created_at').all()

            data = [
                {
                    'id': friend.friend.id,
                    'first_name': friend.friend.first_name,
                    'last_name': friend.friend.last_name,
                    'profile_image_url': friend.friend.registereduser.profile_image_url
                }
                for friend in friends
            ]

        return JsonResponse(data, safe=False, status=200)

    @staticmethod
    def __dismiss_invites(user_id: int, friend_id: int) -> None:
        if Invite.objects.filter(user_id=friend_id, invited_user_id=user_id, type=Invite.INVITE_TYPE_NEW_FRIEND_REQUEST, status=Invite.INVITE_STATUS_PENDING).exists():
            invite = Invite.objects.filter(user_id=friend_id, invited_user_id=user_id, type=Invite.INVITE_TYPE_NEW_FRIEND_REQUEST, status=Invite.INVITE_STATUS_PENDING).get()
            invite.status = Invite.INVITE_STATUS_ACCEPTED
            invite.save()