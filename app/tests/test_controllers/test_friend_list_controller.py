import json

import pytest

from app.controllers.FriendListController import FriendListController
from app.models import FriendList, UserBoardGameCollection


class TestFriendListController:
    friend_list_controller: FriendListController

    def setup_class(self):
        self.friend_list_controller = FriendListController()

    @pytest.mark.skip(reason="Skipping this test for now, will fix later")
    @pytest.mark.django_db
    def test_action_friend_list(self, new_registered_user_fixture, new_registered_users_fixture):
        new_registered_user_fixture.save()
        [registered_user.save() for registered_user in new_registered_users_fixture]

        for new_registered_user in new_registered_users_fixture:
            FriendList.objects.create(
                user_id=new_registered_user.user.id,
                friend_id=new_registered_user_fixture.user.id,
                status=FriendList.STATUS_ACCEPTED,
            )

        result = self.friend_list_controller.action_friend_list(
            user_id=new_registered_user_fixture.user.id,
            limit=15,
            tags=['accepted'],
        )
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 3)

    @pytest.mark.django_db
    def test_action_add_friend(self, new_registered_users_fixture):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        result = self.friend_list_controller.action_add_friend(
            user_id=user.id,
            friend_id=friend.id,
        )

        friends_count = FriendList.objects.filter(
            user=user,
            friend=friend,
            status=FriendList.STATUS_PENDING,
        ).count()

        assert(result.status_code == 200)
        assert(friends_count == 1)

    @pytest.mark.django_db
    def test_action_accept_friend(self, new_registered_users_fixture):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        FriendList.objects.create(
            user=user,
            friend=friend,
            status=FriendList.STATUS_PENDING
        )

        result = self.friend_list_controller.action_accept_friend(
            user_id=friend.id,
            friend_id=user.id,
        )

        friends_count = FriendList.objects.filter(
            user=user,
            friend=friend,
            status=FriendList.STATUS_ACCEPTED,
        ).count()

        assert(result.status_code == 200)
        assert(friends_count == 1)

    @pytest.mark.django_db
    def test_action_reject_friend(self, new_registered_users_fixture):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        FriendList.objects.create(
            user=user,
            friend=friend,
            status=FriendList.STATUS_PENDING
        )

        result = self.friend_list_controller.action_reject_friend(
            user_id=friend.id,
            friend_id=user.id,
        )

        friends_count = FriendList.objects.filter(
            user=user,
            friend=friend,
            status=FriendList.STATUS_REJECTED,
        ).count()

        assert (result.status_code == 200)
        assert (friends_count == 1)

    @pytest.mark.django_db
    def test_action_remove_friend(self, new_registered_users_fixture):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        FriendList.objects.create(
            user=user,
            friend=friend,
            status=FriendList.STATUS_ACCEPTED
        )

        result = self.friend_list_controller.action_remove_friend(
            user_id=friend.id,
            friend_id=user.id,
        )

        friends_count = FriendList.objects.filter(
            user=user,
            friend=friend,
            status=FriendList.STATUS_REMOVED,
        ).count()

        assert (result.status_code == 200)
        assert (friends_count == 1)

    @pytest.mark.django_db
    def test_action_pending_invites(self, new_registered_users_fixture):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        FriendList.objects.create(
            user=user,
            friend=friend,
            status=FriendList.STATUS_PENDING
        )

        result = self.friend_list_controller.action_pending_invites(user_id=friend.id)
        data = json.loads(result.getvalue())

        assert (result.status_code == 200)
        assert (len(data) == 1)

    @pytest.mark.parametrize(
        'status, expected',
        [
            (FriendList.STATUS_PENDING, FriendList.STATUS_PENDING),
            (FriendList.STATUS_ACCEPTED, FriendList.STATUS_ACCEPTED),
        ]
    )
    @pytest.mark.django_db
    def test_action_friend_status(self, new_registered_users_fixture, status, expected):
        [registered_user.save() for registered_user in new_registered_users_fixture]

        user = new_registered_users_fixture[0].user
        friend = new_registered_users_fixture[1].user

        FriendList.objects.create(
            user=user,
            friend=friend,
            status=status,
        )

        result = self.friend_list_controller.action_friend_status(
            user_id=user.id,
            friend_id=friend.id,
        )
        data = json.loads(result.getvalue())

        assert (result.status_code == 200)
        assert (data['status'] == expected)

    @pytest.mark.django_db
    def test_action_friend_status(self, new_registered_user_fixture, new_registered_users_fixture, actual_board_game_fixture):
        new_registered_user_fixture.save()
        [registered_user.save() for registered_user in new_registered_users_fixture]
        actual_board_game_fixture.save()

        for new_registered_user in new_registered_users_fixture:
            UserBoardGameCollection.objects.create(
                user=new_registered_user.user,
                board_game=actual_board_game_fixture,
                status='library',
            )

            FriendList.objects.create(
                user=new_registered_user.user,
                friend=new_registered_user_fixture.user,
                status=FriendList.STATUS_ACCEPTED,
            )

        result = self.friend_list_controller.action_get_friends_with_game(
            user_id=new_registered_user_fixture.user.id,
            game_id=actual_board_game_fixture.id,
        )
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 3)

    @pytest.mark.django_db
    def test_action_get_friends_for_user(self, new_registered_user_fixture, new_registered_users_fixture, actual_board_game_fixture):
        new_registered_user_fixture.save()
        [registered_user.save() for registered_user in new_registered_users_fixture]
        actual_board_game_fixture.save()

        for new_registered_user in new_registered_users_fixture:
            FriendList.objects.create(
                user=new_registered_user.user,
                friend=new_registered_user_fixture.user,
                status=FriendList.STATUS_ACCEPTED,
            )

        result = self.friend_list_controller.action_get_friends_for_user(user_id=new_registered_user_fixture.user.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 3)
