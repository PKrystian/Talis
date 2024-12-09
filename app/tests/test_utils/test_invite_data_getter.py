import pytest

from app.models.invite import Invite
from app.utils.InviteDataGetter import InviteDataGetter


class TestInviteDataGetter:
    invite_data_getter: InviteDataGetter

    def setup_class(self):
        self.invite_data_getter = InviteDataGetter()

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.parametrize(
        'invite_type, expected',
        [
            (Invite.INVITE_TYPE_NEW_FRIEND_REQUEST, 'friend'),
            (Invite.INVITE_TYPE_EVENT_JOIN_REQUEST, 'event'),
        ]
    )
    @pytest.mark.django_db
    def test_get_data_for_invite(self, new_registered_users_fixture, new_event_fixture, invite_type, expected):
        [new_registered_user.save() for new_registered_user in new_registered_users_fixture]
        new_event_fixture.save()

        event = None
        if expected == 'event':
            event = new_event_fixture

        user = new_registered_users_fixture[0].user
        invited_user = new_registered_users_fixture[1].user

        invite = Invite.objects.create(
            user=user,
            invited_user=invited_user,
            event=event,
            type=invite_type,
            status=Invite.INVITE_STATUS_PENDING,
        )

        result = self.invite_data_getter.get_data_for_invite(invite)

        assert(expected in result.keys())
