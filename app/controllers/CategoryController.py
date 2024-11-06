from django.http import JsonResponse

from app.models import Category


class CategoryController:
    ROUTE_GET_ALL = 'get-all-game-categories/'

    @staticmethod
    def action_get_all_game_categories() -> JsonResponse:
        categories = Category.objects.values('id', 'name')

        return JsonResponse(
            data=categories,
            status=200,
            safe=False,
        )
