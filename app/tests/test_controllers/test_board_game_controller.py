import json

import pytest

from app.controllers.BoardGameController import BoardGameController
from app.models import BoardGame, Publisher


class TestBoardGameController:
    board_game_controller: BoardGameController

    def setup_class(self):
        self.board_game_controller = BoardGameController()

    @pytest.mark.django_db
    def test_action_board_game_list(self, new_registered_user_fixture):
        new_registered_user_fixture.save()

        result = self.board_game_controller.action_board_game_list(user_id=new_registered_user_fixture.user.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 2)

    @pytest.mark.django_db
    def test_action_board_game_detail(self, actual_board_game_fixture):
        actual_board_game_fixture.save()

        result = self.board_game_controller.action_board_game_detail(game_id=actual_board_game_fixture.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(data['name'] == actual_board_game_fixture.name)

    @pytest.mark.django_db
    def test_action_board_game_detail(self, new_registered_user_fixture):
        new_registered_user_fixture.save()

        new_board_game_dict = {
            'user_id': new_registered_user_fixture.user.id,
            'game_data[name]': 'Test Game',
            'game_data[year_published]': 2012,
            'game_data[min_players]': 3,
            'game_data[max_players]': 8,
            'game_data[age]': 12,
            'game_data[description]': 'Test Game Description',
            'game_data[image_url]': 'This is an url',
            'game_data[publisher]': 'Unknown Publisher',
        }

        result = self.board_game_controller.action_add_game(new_board_game_dict)
        added_board_game = BoardGame.objects.all()
        added_publisher = Publisher.objects.all()

        assert(result.status_code == 200)
        assert(len(added_board_game) == 1)
        assert (len(added_publisher) == 1)
