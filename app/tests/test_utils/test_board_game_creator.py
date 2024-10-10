import pandas as pd
import pytest

from app.models.board_game import BoardGame
from app.utils.BoardGameCreator import BoardGameCreator
from app.utils.bgg_api import bgg_api_params
from app.views import index


class TestBoardGameCreator:
    board_game_creator: BoardGameCreator

    def setup_class(self):
        self.board_game_creator = BoardGameCreator()

    @pytest.fixture
    def board_game_data_dict_fixture(self):
        yield {
            bgg_api_params.NAME: 'Test Board Game',
            bgg_api_params.YEAR_PUBLISHED: 2000,
            bgg_api_params.MIN_PLAYERS: 3,
            bgg_api_params.MAX_PLAYERS: 12,
            bgg_api_params.AGE: 12,
            bgg_api_params.MIN_PLAYTIME: 60,
            bgg_api_params.MAX_PLAYTIME: 120,
            bgg_api_params.DESCRIPTION: 'This game really slaps',
        }

    def test_load_from_dict(self, board_game_data_dict_fixture):
        new_board_game = (
            self.board_game_creator
            .create()
            .load_from_dict(board_game_data_dict_fixture)
            .get_board_game()
        )

        assert(new_board_game.name == board_game_data_dict_fixture[bgg_api_params.NAME])
        assert(type(new_board_game) == BoardGame)

    @pytest.fixture
    def board_game_data_df_fixture(self):
        yield pd.DataFrame(
            data={
                bgg_api_params.NAME: 'Totally new game never seen before',
                bgg_api_params.YEAR_PUBLISHED: 2015,
                bgg_api_params.MIN_PLAYERS: 10,
                bgg_api_params.MAX_PLAYERS: 20,
                bgg_api_params.AGE: 16,
                bgg_api_params.DESCRIPTION: 'This game offers a wide variety of gameplay potential',
            },
            index=[0]
        )
    
    def test_load_from_df(self, board_game_data_df_fixture):
        new_board_game = (
            self.board_game_creator
            .create()
            .load_from_dataframe(board_game_data_df_fixture)
            .get_board_game()
        )

        assert((new_board_game.name == board_game_data_df_fixture[bgg_api_params.NAME]).any())
        assert(type(new_board_game) == BoardGame)
