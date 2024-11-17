from app.models import Mechanic, Publisher, BoardGameMechanic, BoardGamePublisher
from app.models.board_game import BoardGame
from app.models.category import Category
from app.models.board_game_category import BoardGameCategory
from app.models.registered_user import RegisteredUser
from django.http import JsonResponse
from app.utils.creators.LogErrorCreator import LogErrorCreator

class GameAddController:
    ROUTE = 'game_add/'

    @staticmethod
    def action_add_game(game_data: dict) -> JsonResponse:
        try:
            user_id = game_data.get('user_id')
            registered_user = RegisteredUser.objects.get(user_id=user_id)
            user = registered_user.user

            board_game = BoardGame.objects.create(
                name=game_data.get('game_data[name]'),
                year_published=game_data.get('game_data[year_published]', 0) or 0,
                min_players=game_data.get('game_data[min_players]', 0) or 0,
                max_players=game_data.get('game_data[max_players]', 0) or 0,
                age=game_data.get('game_data[age]', 0) or 0,
                min_playtime=game_data.get('game_data[min_playtime]', 0) or 0,
                max_playtime=game_data.get('game_data[max_playtime]', 0) or 0,
                description=game_data.get('game_data[description]'),
                image_url=game_data.get('game_data[image_url]'),
                rating=0,
                cluster=4,
                added_by=user,
                accepted_by_admin=False
            )

            categories = game_data.get('game_data[categories]', '').split(', ')
            for category_name in categories:
                category, created = Category.objects.get_or_create(name=category_name)
                BoardGameCategory.objects.create(board_game=board_game, category=category)

            mechanics = game_data.get('game_data[mechanics]', '').split(', ')
            for mechanic_name in mechanics:
                mechanic, created = Mechanic.objects.get_or_create(name=mechanic_name)
                BoardGameMechanic.objects.create(board_game=board_game, mechanic=mechanic)

            publisher = game_data.get('game_data[publisher]')
            publisher_category, created = Publisher.objects.get_or_create(name=publisher)
            BoardGamePublisher.objects.create(board_game=board_game, publisher=publisher_category)

        except RegisteredUser.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"User with id {user_id} does not exist",
                trigger='action_add_game',
                class_reference='GameAddController'
            )
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_add_game',
                class_reference='GameAddController'
            )
            return JsonResponse({'error': 'An internal error occurred'}, status=500)

        return JsonResponse({'game_id': board_game.id}, status=200)