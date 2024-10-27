import random

from django.contrib.auth.models import User
from django.db.models import QuerySet
from django.http import JsonResponse

from app.controllers.SearchController import SearchController
from app.models import BoardGame, UserBoardGameCollection, BoardGameCategory
from app.utils.BoardGameRecommender import BoardGameRecommender
from app.utils.getters.BoardGameCategoryGetter import BoardGameCategoryGetter
from app.utils.getters.BoardGameMechanicGetter import BoardGameMechanicGetter
from app.utils.creators.LogErrorCreator import LogErrorCreator


class BoardGameController:
    ROUTE: str = 'board-games/'

    CATEGORY_BASED_ON_YOUR_GAMES = 'Based on your games'
    CATEGORY_WISHLIST = 'Wishlist'
    CATEGORY_ON_TOP = 'On top'
    CATEGORY_BEST_FOR_A_PARTY = 'Best for a party'

    def action_board_game_list(self, request) -> JsonResponse:
        post_data = request.POST

        try:
            user = None

            if 'user_id' in post_data.keys():
                user = User.objects.filter(id__exact=post_data['user_id']).get()

            board_game_recommender = BoardGameRecommender(
                BoardGameCategoryGetter(),
                BoardGameMechanicGetter(),
            )

            board_games_on_top = BoardGame.objects.order_by('-rating')[:SearchController.MEDIUM_LIMIT].values(
                BoardGame.ID,
                BoardGame.NAME,
                BoardGame.IMAGE_URL
            )
            board_games_best_for_a_party = BoardGame.objects.filter(max_players__lt=20, image_url__isnull=False).order_by('-max_players', '-rating')[:SearchController.MEDIUM_LIMIT].values(
                BoardGame.ID,
                BoardGame.NAME,
                BoardGame.IMAGE_URL
            )

            categorized_data = dict()

            if user:
                if UserBoardGameCollection.objects.filter(user_id__exact=user.id, status__in=UserBoardGameCollection.LIBRARY_STATUS).exists():
                    board_games_based_on_your_games = board_game_recommender.recommend_for_user(user=user)
                    if board_games_based_on_your_games:
                        categorized_data[self.CATEGORY_BASED_ON_YOUR_GAMES] = self.__parse_board_games(board_games_based_on_your_games)
                if UserBoardGameCollection.objects.filter(user_id__exact=user.id, status__in=UserBoardGameCollection.WISHLIST_STATUS).exists():
                    board_game_ids = [collection['board_game'] for collection in UserBoardGameCollection.objects.filter(user_id__exact=user.id, status__in=UserBoardGameCollection.WISHLIST_STATUS).values('board_game')]
                    board_games_wishlist = BoardGame.objects.filter(id__in=board_game_ids).values(BoardGame.ID, BoardGame.NAME, BoardGame.IMAGE_URL)
                    categorized_data[self.CATEGORY_WISHLIST] = self.__parse_board_games(board_games_wishlist)

            categorized_data[self.CATEGORY_ON_TOP] = self.__parse_board_games(board_games_on_top)
            categorized_data[self.CATEGORY_BEST_FOR_A_PARTY] = self.__parse_board_games(board_games_best_for_a_party)

            return JsonResponse(categorized_data, safe=False, status=200)

        except User.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"User with id {post_data.get('user_id')} does not exist",
                trigger='action_board_game_list',
                class_reference='BoardGameController'
            )
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_board_game_list',
                class_reference=str(self.__class__)
            )
            return JsonResponse({'error': 'An internal error occurred'}, status=500)

    @staticmethod
    def __parse_board_games(board_games: QuerySet | list) -> list:
        parsed_games = []

        if board_games:
            for board_game in board_games:
                parsed_games.append({
                    BoardGame.ID: board_game[BoardGame.ID],
                    BoardGame.NAME: board_game[BoardGame.NAME],
                    BoardGame.IMAGE_URL: board_game[BoardGame.IMAGE_URL],
                })

        return parsed_games

    ROUTE_GAME_DETAIL: str = 'board-games/<int:game_id>/'

    def action_board_game_detail(self, request, game_id) -> JsonResponse:
        try:
            board_game = BoardGame.objects.prefetch_related(
                'boardgamepublisher_set__publisher',
                'boardgamecategory_set__category',
                'expansions__expansion_board_game'
            ).get(id=game_id)

            publishers = ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()])
            categories = ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()])
            mechanics = ', '.join([bm.mechanic.name for bm in board_game.boardgamemechanic_set.all()])

            is_expansion = board_game.boardgamecategory_set.filter(category_id=BoardGameCategory.CATEGORY_EXPANSION).exists()

            if is_expansion:
                main_game = BoardGame.objects.filter(
                    expansions__expansion_board_game=board_game
                ).exclude(
                    boardgamecategory__category_id=BoardGameCategory.CATEGORY_EXPANSION
                ).first()

                main_game = {
                    'id': main_game.id,
                    'name': main_game.name,
                } if main_game else None
            else:
                main_game = None

            expansions = [{
                'expansion_id': expansion.expansion_board_game.id,
                'expansion_name': expansion.expansion_board_game.name
            } for expansion in board_game.expansions.all()]

            data = {
                'id': board_game.id,
                'name': board_game.name,
                'year_published': board_game.year_published,
                'description': board_game.description,
                'image_url': board_game.image_url,
                'min_players': board_game.min_players,
                'max_players': board_game.max_players,
                'age': board_game.age,
                'min_playtime': board_game.min_playtime,
                'max_playtime': board_game.max_playtime,
                'rating': board_game.rating,

                'publisher': publishers,
                'category': categories,
                'mechanic': mechanics,
                'expansions': expansions,
                'main_game': main_game,
            }

            return JsonResponse(data)

        except BoardGame.DoesNotExist:
            return JsonResponse({'error': 'BoardGame not found'}, status=404)

    @staticmethod
    def get_shuffled_games(board_games) -> list:
        board_games_list = list(board_games)
        random.shuffle(board_games_list)
        return board_games_list
