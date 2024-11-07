from types import NoneType

from django.contrib.auth.models import User
from django.http import JsonResponse

from app.models.invite import Invite
from app.utils.InviteDataGetter import InviteDataGetter


class InviteController:
    BASE_ROUTE = 'invite/'

    ROUTE_GET = BASE_ROUTE + 'get/'

    @staticmethod
    def action_get_invites(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        data = []

        if Invite.objects.filter(invited_user=user_id).exists():
            invite_data_getter = InviteDataGetter()

            invites = Invite.objects.filter(
                invited_user=user_id,
                status=Invite.INVITE_STATUS_PENDING,
            ).order_by('-created_at').all()

            data = []

            for invite in invites:
                data.append(invite_data_getter.get_data_for_invite(invite))

        return JsonResponse(
            data=data,
            safe=False,
            status=200,
        )

    ROUTE_GET_JOIN_REQUESTS = BASE_ROUTE + 'get-join-requests/'

    @staticmethod
    def action_get_join_requests(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        data = []

        if Invite.objects.filter(
            user_id__exact=user_id,
            type__exact=Invite.INVITE_TYPE_EVENT_JOIN_REQUEST,
        ).exists():
            event_join_requests = Invite.objects.filter(
                user_id__exact=user_id,
                type__exact=Invite.INVITE_TYPE_EVENT_JOIN_REQUEST
            ).all()

            data = [
                {
                    'event_id': event_join_request.event.id,
                    'invite_status': event_join_request.status,
                } for event_join_request in event_join_requests
            ]

        return JsonResponse(
            data=data,
            safe=False,
            status=200,
        )

    ROUTE_ACCEPT_REJECT_INVITE = BASE_ROUTE + 'invite-accept-reject/'

    @staticmethod
    def action_accept_or_reject_invite(request) -> JsonResponse:
        invite_id = request.POST.get('invite_id')
        choice = request.POST.get('choice')

        invite = Invite.objects.get(id=invite_id)

        if choice == Invite.INVITE_STATUS_ACCEPTED:
            invite.status = Invite.INVITE_STATUS_ACCEPTED
            invite.event.set_attendees([invite.invited_user])
        if choice == Invite.INVITE_STATUS_REJECTED:
            invite.status = Invite.INVITE_STATUS_REJECTED
        if choice == Invite.INVITE_STATUS_DISMISSED:
            invite.status = Invite.INVITE_STATUS_DISMISSED

        invite.save()

        return JsonResponse(
            data={'detail': 'Action succesful'},
            status=200,
        )
