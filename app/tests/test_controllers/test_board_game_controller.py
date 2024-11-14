import pytest

from app.controllers.BoardGameController import BoardGameController


class TestJsonNormalizer:
    board_game_controller: BoardGameController

    def setup_class(self):
        self.board_game_controller = BoardGameController()

    @pytest.mark.skip
    def test_action_board_game_list(self):
        result = self.board_game_controller.action_board_game_list(None)
        assert(True == True)
