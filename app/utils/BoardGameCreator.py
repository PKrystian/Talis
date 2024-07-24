import pandas as pd
from typing import Self

from app.models.board_game import BoardGame
from app.utils.bgg_api import api_params
from app.utils.JsonNormalizer import JsonNormalizer


class BoardGameCreator:
    __board_game: BoardGame

    def create(self) -> Self:
        self.__board_game = BoardGame()
        return self

    def load_from_dataframe(self, df: pd.DataFrame) -> Self:
        for column in df.keys():
            if pd.isna(df[column]) is not True:
                if column in api_params.ARRAY_FIELDS:
                    self.__board_game.setter_mapper[column](JsonNormalizer.normalize_from_string(df[column]))
                    continue
                if column in api_params.ALL_FIELDS:
                    self.__board_game.setter_mapper[column](df[column])

        return self

    def get_board_game(self) -> BoardGame:
        return self.__board_game
