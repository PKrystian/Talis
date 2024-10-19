from app.models.board_game import BoardGame
from app.models.board_game_category import BoardGameCategory
from app.models.category import Category


class BoardGameCategoryGetter:
    @staticmethod
    def get_categories_for_board_game(board_game: BoardGame) -> list:
        categories = []

        if BoardGameCategory.objects.filter(board_game_id__exact=board_game.id).exists():
            category_ids = [category_ids['category_id'] for category_ids in BoardGameCategory.objects.filter(board_game_id__exact=board_game.id).values('category_id')]
            categories = [category['name'] for category in Category.objects.filter(id__in=category_ids).values('name')]

        return categories
