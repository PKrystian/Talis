import pandas as pd
from typing import Self

from app.models.board_game import BoardGame
from app.utils.bgg_api import bgg_api_params
from app.utils.JsonNormalizer import JsonNormalizer


class BoardGameCreator:
    __board_game: BoardGame

    def create(self) -> Self:
        self.__board_game = BoardGame()
        return self
    
    def load_from_dict(self, dict_data: dict) -> Self:
        for key, value in dict_data.items():
            self.__board_game.setter_mapper[key](value)

        return self

    def load_from_dataframe(self, df: pd.DataFrame) -> Self:
        for column in df.keys():
            if pd.isna(df[column]) is not True:
                col = column
                if column in BoardGame.BGG_TO_BOARD_GAME_FEATURE_MAP.keys():
                    col = BoardGame.BGG_TO_BOARD_GAME_FEATURE_MAP[column]

                if column in bgg_api_params.ARRAY_FIELDS:
                    self.__board_game.setter_mapper[col](JsonNormalizer.normalize_from_string(df[column]))
                    continue

                if column in bgg_api_params.ALL_FIELDS:
                    self.__board_game.setter_mapper[col](df[column])

        return self

    def get_board_game(self) -> BoardGame:
        return self.__board_game
