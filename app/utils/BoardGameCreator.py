import pandas as pd

from app.models.board_game import BoardGame
from app.utils.bgg_api import api_params
from app.utils.JsonNormalizer import JsonNormalizer


class BoardGameCreator:
    @staticmethod
    def create_from_dataframe(df: pd.DataFrame) -> BoardGame:
        board_game = BoardGame()

        property_mapper = {
            api_params.NAME: board_game.set_name,
            api_params.YEAR_PUBLISHED: board_game.set_year_published,
            api_params.BOARD_GAME_CATEGORY: board_game.set_category,
            api_params.BOARD_GAME_MECHANIC: board_game.set_mechanic,
            api_params.BOARD_GAME_PUBLISHER: board_game.set_publisher,
            api_params.MIN_PLAYERS: board_game.set_min_players,
            api_params.MAX_PLAYERS: board_game.set_max_players,
            api_params.AGE: board_game.set_age,
            api_params.MIN_PLAYTIME: board_game.set_min_playtime,
            api_params.MAX_PLAYTIME: board_game.set_max_playtime,
            api_params.BOARD_GAME_EXPANSION: board_game.set_expansion,
            api_params.DESCRIPTION: board_game.set_description,
            api_params.IMAGE: board_game.set_image_url,
        }

        for column in df.keys():
            if pd.isna(df[column]) is not True:
                if column in api_params.ARRAY_FIELDS:
                    property_mapper[column](JsonNormalizer.normalize_from_string(df[column]))
                    continue
                if column in api_params.ALL_FIELDS:
                    property_mapper[column](df[column])

        return board_game