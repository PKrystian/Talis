import pytest

from app.models.board_game import BoardGame
from app.utils.BoardGameCreator import BoardGameCreator
from app.utils.bgg_api import api_params


class TestBoardGameCreator:
    @pytest.fixture
    def board_game_data_dict_fixture(self):
        return {
            api_params.NAME: 'Test Board Game',
            api_params.YEAR_PUBLISHED: 2000,
            api_params.MIN_PLAYERS: 3,
            api_params.MAX_PLAYERS: 12,
            api_params.AGE: 12,
            api_params.MIN_PLAYTIME: 60,
            api_params.MAX_PLAYTIME: 120,
            api_params.DESCRIPTION: 'This game really slaps',
        }
    
    def test_load_from_dict(self, board_game_data_dict_fixture):
        board_game_creator = BoardGameCreator()
        board_game_creator.create()
        board_game_creator.load_from_dict(board_game_data_dict_fixture)
        new_board_game = board_game_creator.get_board_game()
        
        assert(new_board_game.name == board_game_data_dict_fixture[api_params.NAME])
        assert(type(new_board_game) == BoardGame)

    @pytest.fixture
    def board_game_data_df_fixture(self):
        return {}
    
    def test_load_from_df(self, board_game_data_df_fixture):
        assert('' == '')
