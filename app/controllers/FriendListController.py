from app.models import UserBoardGameCollection
from app.models.friend_list import FriendList
from django.http import JsonResponse


class FriendListController:
    ROUTE_DETAIL: str = 'friends/'

    @staticmethod
    def action_friend_list(request, user_id, limit, tags) -> JsonResponse:
        friend_list_1 = FriendList.objects.filter(user_id=user_id, status=tags).order_by('-created_at')[:limit]
        friend_list_2 = FriendList.objects.filter(friend_id=user_id, status=tags).order_by('-created_at')[:limit]

        data = []

        for friend in friend_list_1:
            data.append({
                'id': friend.friend.id,
                'username': friend.friend.username,
                'first_name': friend.friend.first_name,
                'last_name': friend.friend.last_name,
                'profile_image_url': friend.friend.registereduser.profile_image_url,
            })

        for friend in friend_list_2:
            data.append({
                'id': friend.user.id,
                'username': friend.user.username,
                'first_name': friend.user.first_name,
                'last_name': friend.user.last_name,
                'profile_image_url': friend.user.registereduser.profile_image_url,
            })

        return JsonResponse(data, safe=False)

    ROUTE_ADD: str = 'add_friend/'

    @staticmethod
    def action_add_friend(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        friend_id = request.POST.get('friend_id')

        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(
            user_id=user_id,
            friend_id=friend_id,
            status__in=['pending', 'accepted']
        ).order_by('-created_at').first()

        if friend_list:
            return JsonResponse({'error': 'Friend already exists.'}, status=400)

        FriendList.objects.create(user_id=user_id, friend_id=friend_id, status='pending')

        return JsonResponse({'success': True})

    ROUTE_ACCEPT: str = 'accept_friend/'

    @staticmethod
    def action_accept_friend(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        friend_id = request.POST.get('friend_id')

        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()
        if not friend_list:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        friend_list.status = 'accepted'
        friend_list.save()

        return JsonResponse({'success': True})

    ROUTE_REJECT: str = 'reject_friend/'

    @staticmethod
    def action_reject_friend(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        friend_id = request.POST.get('friend_id')

        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()
        if not friend_list:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        friend_list.status = 'rejected'
        friend_list.save()

        return JsonResponse({'success': True})

    ROUTE_REMOVE: str = 'remove_friend/'

    @staticmethod
    def action_remove_friend(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        friend_id = request.POST.get('friend_id')

        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=user_id, friend_id=friend_id).order_by('-created_at').first()
        friend_list_2 = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()

        if not friend_list and not friend_list_2:
            return JsonResponse({'error': 'Friend does not exist.'}, status=400)

        if friend_list:
            friend_list.status = 'removed'
            friend_list.save()

        if friend_list_2:
            friend_list_2.status = 'removed'
            friend_list_2.save()

        return JsonResponse({'success': True})

    ROUTE_INVITES: str = 'friend_invites/'

    @staticmethod
    def action_pending_invites(request, user_id) -> JsonResponse:
        pending_invites = FriendList.objects.filter(friend_id=user_id, status='pending')
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
    def action_friend_status(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        friend_id = request.POST.get('friend_id')

        if not user_id or not friend_id:
            return JsonResponse({'error': 'User ID and friend ID are required.'}, status=400)

        friend_list = FriendList.objects.filter(user_id=user_id, friend_id=friend_id).order_by('-created_at').first()
        friend_list_2 = FriendList.objects.filter(user_id=friend_id, friend_id=user_id).order_by('-created_at').first()

        if friend_list and friend_list_2:
            if friend_list.created_at > friend_list_2.created_at:
                combined_friend_list = friend_list
            else:
                combined_friend_list = friend_list_2
        elif friend_list_2:
            combined_friend_list = friend_list_2
        else:
            combined_friend_list = friend_list

        if combined_friend_list:
            return JsonResponse({'status': combined_friend_list.status})
        else:
            return JsonResponse({'status': 'not_friends'})

    ROUTE_WITH_GAME: str = 'friends_with_game/'

    @staticmethod
    def action_get_friends_with_game(request, user_id, game_id):
        friend_list = FriendList.objects.filter(user_id=user_id).order_by('-created_at')
        friend_list_2 = FriendList.objects.filter(friend_id=user_id).order_by('-created_at')

        combined_friend_list = friend_list | friend_list_2

        friend_list_ids = combined_friend_list.filter(status='accepted').values_list('friend_id', flat=True)

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
            for collection in friends_with_game[:3]
        ]

        return JsonResponse(data, safe=False)

    ROUTE_GET_ALL = 'get_friends/'

    @staticmethod
    def action_get_friends_for_user(request) -> JsonResponse:
        user_id = request.POST.get('user_id')

        data = []

        if FriendList.objects.filter(user_id__exact=user_id).exists():
            friends = FriendList.objects.filter(user_id=user_id).order_by('-created_at').all()

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
