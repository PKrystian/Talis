import random
from django.db.models import Q
from django.http import JsonResponse

from app.controllers.SearchController import SearchController
from app.models import BoardGame


class BoardGameController:
    ROUTE: str = 'board-games/'

    def action_board_game_list(self) -> JsonResponse:
        board_games = BoardGame.objects.filter(
            Q(rating__isnull=False) &
            Q(year_published__isnull=False)
        ).prefetch_related(
            'boardgamepublisher_set__publisher',
            'boardgamecategory_set__category',
            'expansions__expansion_board_game'
        ).filter(
            Q(boardgamepublisher__isnull=False) &
            Q(boardgamecategory__isnull=False)
        ).distinct().order_by('-rating')[:SearchController.MEDIUM_LIMIT]

        data = []

        for board_game in board_games:
            publishers = ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()])
            categories = ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()])
            expansions = [{
                'expansion_id': expansion.expansion_board_game.id,
                'expansion_name': expansion.expansion_board_game.name
            } for expansion in board_game.expansions.all()]

            data.append({
                'id': board_game.id,
                'name': board_game.name,
                'year_published': board_game.year_published,
                'publisher': publishers,
                'category': categories,
                'expansions': expansions,
                'description': board_game.description,
                'min_players': board_game.min_players,
                'max_players': board_game.max_players,
                'age': board_game.age,
                'min_playtime': board_game.min_playtime,
                'max_playtime': board_game.max_playtime,
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
            expansions = [{
                'expansion_id': expansion.expansion_board_game.id,
                'expansion_name': expansion.expansion_board_game.name
            } for expansion in board_game.expansions.all()]

            data = {
                'id': board_game.id,
                'name': board_game.name,
                'year_published': board_game.year_published,
                'publisher': publishers,
                'category': categories,
                'expansions': expansions,
                'description': board_game.description,
                'min_players': board_game.min_players,
                'max_players': board_game.max_players,
                'age': board_game.age,
                'min_playtime': board_game.min_playtime,
                'max_playtime': board_game.max_playtime,
                'image_url': board_game.image_url,
            }

            return JsonResponse(data)
        except BoardGame.DoesNotExist:
            return JsonResponse({'error': 'BoardGame not found'}, status=404)

    @staticmethod
    def get_shuffled_games(board_games) -> list:
        board_games_list = list(board_games)
        random.shuffle(board_games_list)
        return board_games_list
