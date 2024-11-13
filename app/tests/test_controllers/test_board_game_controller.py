import pytest

from app.controllers.BoardGameController import BoardGameController


class TestJsonNormalizer:
    board_game_controller: BoardGameController

    def setup_class(self):
        self.board_game_controller = BoardGameController()

    def test_action_board_game_list(self, test_string, expected):
        result = self.board_game_controller.action_board_game_list(None)
        assert(result == expected)
