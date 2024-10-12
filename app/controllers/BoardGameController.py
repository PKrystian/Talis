import random
from django.db.models import Q
from django.http import JsonResponse

from app.controllers.SearchController import SearchController
from app.models import BoardGame


class BoardGameController:
    ROUTE: str = 'board-games/'

    def action_board_game_list(self) -> JsonResponse:
        board_games = BoardGame.objects.order_by('-rating')[:SearchController.MEDIUM_LIMIT]
        data = []

        for board_game in board_games:
            data.append({
                'id': board_game.id,
                'name': board_game.name,
                'image_url': board_game.image_url,
            })

        categorized_data = self.categorize_games(data)

        return JsonResponse(categorized_data, safe=False)

    def categorize_games(self, board_games) -> dict:
        categories = [
            'Based on your games',
            'Wishlist',
            'On top recently',
            'Best for a party',
            'Best ice breaker',
        ]

        categorized_games = {category: self.get_shuffled_games(board_games) for category in categories}
        return categorized_games

    ROUTE_GAME_DETAIL: str = 'board-games/<int:game_id>/'

    @staticmethod
    def action_board_game_detail(request, game_id) -> JsonResponse:
        try:
            board_game = BoardGame.objects.prefetch_related(
                'boardgamepublisher_set__publisher',
                'boardgamecategory_set__category',
                'expansions__expansion_board_game'
            ).get(id=game_id)

            publishers = ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()])
            categories = ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()])

            is_expansion = board_game.boardgamecategory_set.filter(category_id=32).exists()

            if is_expansion:
                main_game = BoardGame.objects.filter(
                    expansions__expansion_board_game=board_game
                ).exclude(
                    boardgamecategory__category_id=32
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
