from django.core.management.base import BaseCommand

from app.models import BoardGame
from app.utils.BoardGameRecommender import BoardGameRecommender
from app.utils.getters.BoardGameCategoryGetter import BoardGameCategoryGetter
from app.utils.getters.BoardGameMechanicGetter import BoardGameMechanicGetter


class Command(BaseCommand):
    help: str = 'Runs predict on every BoardGame and assigns it to a cluster'

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            'force_all',
            nargs='?',
            type=int,
            default=0,
            help='Force re-clustering for all board games [ 0 - default run | 1 - force all ]'
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write('Starting...')
        force_all = options['force_all']

        board_game_recommender = BoardGameRecommender(
            BoardGameCategoryGetter(),
            BoardGameMechanicGetter(),
        )

        if force_all:
            board_games = BoardGame.objects.all()
        else:
            board_games = BoardGame.objects.filter(cluster__isnull=True).all()

        total = len(board_games)
        current_count = 0

        for board_game in board_games:
            cluster = board_game_recommender.get_cluster_for_board_game(board_game)
            board_game.set_cluster(cluster)
            board_game.save()

            current_count += 1
            print(f'Processing {current_count} / {total}')
