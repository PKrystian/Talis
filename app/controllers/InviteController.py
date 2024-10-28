from django.http import JsonResponse

from app.models.invite import Invite


class InviteController:
    BASE_ROUTE = 'invite/'

    ROUTE_GET = BASE_ROUTE + 'get/'

    @staticmethod
    def action_get_invites(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        data = []

        if Invite.objects.filter(invited_user=user_id).exists():
            invites = Invite.objects.filter(invited_user=user_id).order_by('-created_at').all()

            data = [
                {
                    'id': invite.id,
                    'friend': {
                        'id': invite.user.id,
                        'first_name': invite.user.first_name,
                        'last_name': invite.user.last_name,
                        'profile_image_url': invite.user.registereduser.profile_image_url
                    },
                    'event': {
                        'id': invite.event.id,
                        'title': invite.event.title
                    }
                } for invite in invites
            ]

        return JsonResponse(
            data=data,
            safe=False,
            status=200,
        )
