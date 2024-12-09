import json

import pytest

from app.controllers.CollectionController import CollectionController
from app.models import UserBoardGameCollection


class TestCollectionController:
    collection_controller: CollectionController

    def setup_class(self):
        self.collection_controller = CollectionController()

    @pytest.mark.parametrize('status', ['wishlist', 'library'])
    @pytest.mark.django_db
    def test_action_user_collection(self, new_registered_user_fixture, actual_board_game_fixture, status):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        UserBoardGameCollection.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            status=status,
        )

        result = self.collection_controller.action_user_collection(user_id=new_registered_user_fixture.user.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(status in data.keys())
        assert(len(data[status]) == 1)
        assert(data[status][0]['name'] == actual_board_game_fixture.name)

    @pytest.mark.parametrize('status', ['wishlist', 'library'])
    @pytest.mark.django_db
    def test_action_add_to_collection(self, new_registered_user_fixture, actual_board_game_fixture, status):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        result = self.collection_controller.action_add_to_collection(
            user_id=new_registered_user_fixture.user.id,
            board_game_id=actual_board_game_fixture.id,
            status=status,
        )

        collection = UserBoardGameCollection.objects.filter(
            user=new_registered_user_fixture.user,
            status=status,
        ).all()

        assert(result.status_code == 200)
        assert(len(collection) == 1)

    @pytest.mark.parametrize('status', ['wishlist', 'library'])
    @pytest.mark.django_db
    def test_action_remove_from_collection(self, new_registered_user_fixture, actual_board_game_fixture, status):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        UserBoardGameCollection.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            status=status,
        )

        result = self.collection_controller.action_remove_from_collection(
            user_id=new_registered_user_fixture.user.id,
            board_game_id=actual_board_game_fixture.id,
            status=status,
        )

        collection = UserBoardGameCollection.objects.filter(
            user=new_registered_user_fixture.user,
            status=status,
        ).all()

        assert (result.status_code == 200)
        assert (len(collection) == 0)
