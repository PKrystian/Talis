import math
import pickle
import pandas as pd
import warnings
from django.contrib.auth.models import User

from django.db.models import Max

from app.controllers.SearchController import SearchController
from app.models import UserBoardGameCollection, BoardGameCategory
from app.models.board_game import BoardGame
from app.models.category import Category
from app.models.mechanic import Mechanic
from app.utils.creators.LogErrorCreator import LogErrorCreator
from app.utils.getters.BoardGameCategoryGetter import BoardGameCategoryGetter
from app.utils.getters.BoardGameMechanicGetter import BoardGameMechanicGetter


class BoardGameRecommender:
    MODELS_FOLDER: str = 'ml_model/'
    MODEL_FILENAME: str = 'recommendation_model.sav'
    DEFAULT_VALUE: int = 0
    CATEGORIES_MATCH_PERCENT = 0.5
    CUSTOM_CLUSTER = 5

    __board_game_category_getter: BoardGameCategoryGetter
    __board_game_mechanic_getter: BoardGameMechanicGetter

    def __init__(self, board_game_category_getter, board_game_mechanic_getter) -> None:
        warnings.simplefilter(action='ignore', category=pd.errors.PerformanceWarning)

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

    def get_cluster_for_board_game(self, board_game: BoardGame) -> int:
        self.__convert_to_template(board_game)

        try:
            cluster = self.recommendation_model.predict(self.prediction_template)[0]
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='get_cluster_for_board_game',
                class_reference=str(self.__class__)
            )
            return self.CUSTOM_CLUSTER

        return cluster

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

    def recommend_for_user(self, user: User, limit: int = SearchController.MEDIUM_LIMIT) -> list:
        recommended_games_list = []
        recommendations_per_library_game = 1

        board_game_ids = [collection['board_game'] for collection in UserBoardGameCollection.objects.filter(
            user_id__exact=user.id,
            status__in=UserBoardGameCollection.LIBRARY_STATUS
            ).order_by('-created_at').values('board_game')]

        library_games = BoardGame.objects.filter(id__in=board_game_ids).all()

        game_ids_to_exclude = board_game_ids

        if len(library_games) > limit:
            library_games = library_games[:limit]
        if len(library_games) < limit:
            recommendations_per_library_game = math.ceil(limit / len(library_games))

        for library_game in library_games:
            if recommended_games_list:
                game_ids_to_exclude.extend([recommended_game[BoardGame.ID] for recommended_game in recommended_games_list])

            cluster = self.get_cluster_for_board_game(library_game)

            recommended_games_list.extend(self.__get_recommendations_for_game(
                board_game=library_game,
                cluster=cluster,
                recommendations_count=recommendations_per_library_game,
                existing_recommendations=game_ids_to_exclude
            ))

        return recommended_games_list[:limit]
    
    def __get_recommendations_for_game(self, board_game: BoardGame, cluster: int, recommendations_count: int, existing_recommendations: list) -> list:
        game_category_ids = self.__board_game_category_getter.get_categories_for_board_game(board_game, True)

        if BoardGameCategory.CATEGORY_EXPANSION in game_category_ids:
            game_category_ids.remove(BoardGameCategory.CATEGORY_EXPANSION)

        if len(game_category_ids) > 1:
            category_limit = math.ceil(self.CATEGORIES_MATCH_PERCENT * len(game_category_ids))
            game_category_ids = game_category_ids[:category_limit]

        board_game_ids = [board_game_id['board_game'] for board_game_id in BoardGameCategory.objects.filter(
                category_id__in=game_category_ids,
            ).exclude(
                board_game_id__in=existing_recommendations,
            ).exclude(
                category_id__exact=BoardGameCategory.CATEGORY_EXPANSION,
            ).values('board_game')]

        recommendations = BoardGame.objects.filter(
            id__in=board_game_ids,
            cluster__exact=cluster,
        ).order_by('-rating').values(BoardGame.ID, BoardGame.NAME, BoardGame.IMAGE_URL, BoardGame.RATING, BoardGame.ADDED_BY, BoardGame.ACCEPTED_BY_ADMIN)[:recommendations_count]

        return recommendations
