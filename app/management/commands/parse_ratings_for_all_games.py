from django.core.management.base import BaseCommand, CommandError

from app.utils.bgg_api.BoardGameDataAPIDownloader import BoardGameDataAPIDownloader
from app.utils.bgg_api import bgg_api_params
from app.models.board_game import BoardGame


class Command(BaseCommand):
    help: str = 'Command that parses ratings from bgg api and saves them to respective records in the database'

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            'batch_size',
            nargs='?',
            type=int,
            default=500,
            help='LIMIT for dataset querying at one given time'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']

        board_game_data_downloader = BoardGameDataAPIDownloader()
        game_count = BoardGame.objects.filter(rating__exact=None).count()

        downloaded_counter = 0

        for offset in range(0, game_count, batch_size):
            board_games = BoardGame.objects.filter(rating__exact=None).all()[offset: offset + batch_size]

            for game in board_games:
                api_game_id = board_game_data_downloader.get_ids_from_search([game])
                api_game = board_game_data_downloader.fetch_with_ids(
                    game_ids=api_game_id,
                    api_fields=[bgg_api_params.STATISTICS]
                )

                if api_game and bgg_api_params.STATISTICS in api_game[0].keys():
                    game.set_rating(api_game[0][bgg_api_params.STATISTICS])
                else:
                    game.set_rating(0)

                game.save()

                downloaded_counter += 1
                self.stdout.write(f'Ratings set: {downloaded_counter} / {game_count}')
