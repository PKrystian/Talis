import json

import pytest

from app.controllers.InviteController import InviteController
from app.models.invite import Invite


class TestInviteController:
    invite_controller: InviteController

    def setup_class(self):
        self.invite_controller = InviteController()

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_invites(self, new_registered_user_fixture, new_event_fixture):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        Invite.objects.create(
            user=new_event_fixture.host,
            invited_user=new_registered_user_fixture.user,
            event=new_event_fixture,
            type=Invite.INVITE_TYPE_EVENT_INVITED_FRIEND,
            status=Invite.INVITE_STATUS_PENDING,
        )

        result = self.invite_controller.action_get_invites(user_id=new_registered_user_fixture.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_join_requests(self, new_registered_user_fixture, new_event_fixture):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        Invite.objects.create(
            user=new_event_fixture.host,
            invited_user=new_registered_user_fixture.user,
            event=new_event_fixture,
            type=Invite.INVITE_TYPE_EVENT_JOIN_REQUEST,
            status=Invite.INVITE_STATUS_PENDING,
        )

        result = self.invite_controller.action_get_join_requests(user_id=new_event_fixture.host.id)
        data = json.loads(result.getvalue())

        assert (result.status_code == 200)
        assert (len(data) == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.parametrize(
        'choice, expected',
        [
            (Invite.INVITE_STATUS_REJECTED, Invite.INVITE_STATUS_REJECTED),
            (Invite.INVITE_STATUS_ACCEPTED, Invite.INVITE_STATUS_ACCEPTED),
        ]
    )
    @pytest.mark.django_db
    def test_action_accept_or_reject_invite(self, new_registered_user_fixture, new_event_fixture, choice, expected):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        invite = Invite.objects.create(
            user=new_event_fixture.host,
            invited_user=new_registered_user_fixture.user,
            event=new_event_fixture,
            type=Invite.INVITE_TYPE_EVENT_JOIN_REQUEST,
            status=Invite.INVITE_STATUS_PENDING,
        )

        result = self.invite_controller.action_accept_or_reject_invite(
            invite_id=invite.id,
            choice=choice,
        )

        invite.refresh_from_db()
        new_event_fixture.refresh_from_db()

        if choice == Invite.INVITE_STATUS_ACCEPTED:
            assert(new_event_fixture.attendees.count() == 1)

        assert(result.status_code == 200)
        assert(invite.status == expected)
