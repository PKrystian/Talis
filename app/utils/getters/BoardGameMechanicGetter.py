from app.models.board_game import BoardGame
from app.models.board_game_mechanic import BoardGameMechanic
from app.models.mechanic import Mechanic


class BoardGameMechanicGetter:
    @staticmethod
    def get_mechanics_for_board_game(board_game: BoardGame) -> list:
        mechanics = []

        if BoardGameMechanic.objects.filter(board_game_id__exact=board_game.id).values('mechanic_id').exists():
            mechanic_ids = [mechanic_ids['mechanic_id'] for mechanic_ids in BoardGameMechanic.objects.filter(board_game_id__exact=board_game.id).values('mechanic_id')]
            mechanics = [mechanic['name'] for mechanic in Mechanic.objects.filter(id__in=mechanic_ids).values('name')]

        return mechanics
