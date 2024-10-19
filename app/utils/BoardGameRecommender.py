import pickle
import pandas as pd

from django.db.models import Max

from app.models.board_game import BoardGame
from app.models.category import Category
from app.models.mechanic import Mechanic
from app.utils.getters.BoardGameCategoryGetter import BoardGameCategoryGetter
from app.utils.getters.BoardGameMechanicGetter import BoardGameMechanicGetter


class BoardGameRecommender:
    MODELS_FOLDER: str = 'ml_model/'
    MODEL_FILENAME: str = 'recommendation_model.sav'
    DEFAULT_VALUE: int = 0

    __board_game_category_getter: BoardGameCategoryGetter
    __board_game_mechanic_getter: BoardGameMechanicGetter

    def __init__(self, board_game_category_getter, board_game_mechanic_getter) -> None:
        self.recommendation_model = pickle.load(open(self.MODELS_FOLDER + self.MODEL_FILENAME, 'rb'))

        self.__board_game_category_getter = board_game_category_getter
        self.__board_game_mechanic_getter = board_game_mechanic_getter

        self.MAX_MIN_PLAYERS_SCALAR = self.__get_max_for_column(BoardGame.MIN_PLAYERS)
        self.MAX_MAX_PLAYERS_SCALAR = self.__get_max_for_column(BoardGame.MAX_PLAYERS)
        self.MAX_AGE_SCALAR = self.__get_max_for_column(BoardGame.AGE)
        self.MAX_MIN_PLAYTIME_SCALAR = self.__get_max_for_column(BoardGame.MIN_PLAYTIME)
        self.MAX_MAX_PLAYTIME_SCALAR = self.__get_max_for_column(BoardGame.MAX_PLAYTIME)
        self.MAX_RATING_SCALAR = self.__get_max_for_column(BoardGame.RATING)

        self.prediction_template = pd.DataFrame(
            data={
                BoardGame.MIN_PLAYERS: [self.DEFAULT_VALUE],
                BoardGame.MAX_PLAYERS: [self.DEFAULT_VALUE],
                BoardGame.AGE: [self.DEFAULT_VALUE],
                BoardGame.MIN_PLAYTIME: [self.DEFAULT_VALUE],
                BoardGame.MAX_PLAYTIME: [self.DEFAULT_VALUE],
                BoardGame.RATING: [self.DEFAULT_VALUE]
            }
        )

        all_categories = [category['name'] for category in Category.objects.values('name')]
        all_mechanics = [mechanic['name'] for mechanic in Mechanic.objects.values('name')]

        for category in all_categories:
            self.prediction_template[category] = self.DEFAULT_VALUE

        for mechanic in all_mechanics:
            self.prediction_template[mechanic] = self.DEFAULT_VALUE

    def get_cluster_for_board_game(self, board_game: BoardGame) -> list:
        self.__convert_to_template(board_game)
        return self.recommendation_model.predict(self.prediction_template)[0]

    def __convert_to_template(self, board_game: BoardGame) -> None:
        self.prediction_template[BoardGame.MIN_PLAYERS] = board_game.min_players / self.MAX_MIN_PLAYERS_SCALAR
        self.prediction_template[BoardGame.MAX_PLAYERS] = board_game.max_players / self.MAX_MAX_PLAYERS_SCALAR
        self.prediction_template[BoardGame.AGE] = board_game.age / self.MAX_AGE_SCALAR
        self.prediction_template[BoardGame.MIN_PLAYTIME] = board_game.min_playtime / self.MAX_MIN_PLAYTIME_SCALAR
        self.prediction_template[BoardGame.MAX_PLAYTIME] = board_game.max_playtime / self.MAX_MAX_PLAYTIME_SCALAR
        self.prediction_template[BoardGame.RATING] = board_game.rating / self.MAX_RATING_SCALAR

        board_game_categories = self.__board_game_category_getter.get_categories_for_board_game(board_game)
        board_game_mechanics = self.__board_game_mechanic_getter.get_mechanics_for_board_game(board_game)

        for category in board_game_categories:
            self.prediction_template[category] = 1

        for mechanic in board_game_mechanics:
            self.prediction_template[mechanic] = 1

    @staticmethod
    def __get_max_for_column(column: str) -> float:
        return BoardGame.objects.aggregate(max_val=Max(column))['max_val']
