import json

import pytest

from app.controllers.SearchController import SearchController


class TestSearchController:
    search_controller: SearchController

    def setup_class(self):
        self.search_controller = SearchController()

    @pytest.mark.django_db
    def test_action_search_board_games(self, actual_board_game_fixture):
        actual_board_game_fixture.save()

        result = self.search_controller.action_search_board_games(
            query='Die',
            limit=10,
            page=1,
            query_params={},
        )
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data['results']) == 1)
        assert(data['results'][0]['name'] == actual_board_game_fixture.name)
