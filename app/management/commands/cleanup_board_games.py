from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.management.base import BaseCommand

from app.models import BoardGame
from app.utils.LogErrorCreator import LogErrorCreator
from app.utils.bgg_api import api_params
from app.utils.bgg_api.BoardGameDataAPIDownloader import BoardGameDataAPIDownloader


class Command(BaseCommand):
    help: str = 'Changes non English board game names to proper ones and cleans up non board game type games from db'

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            'offset',
            nargs='?',
            type=int,
            default=0,
            help='offset for games'
        )

    def handle(self, *args, **options) -> None:
        self.stdout.write('Importing board games...')
        offset = options['offset']

        removed_games = 0
        changed_names = 0
        max_id = 430000

        board_game_data_api_downloader = BoardGameDataAPIDownloader()
        log_error_creator = LogErrorCreator()

        while offset < max_id:
            print(f'Processing {offset} / {max_id} | Removed: {removed_games} | Changed: {changed_names}')
            api_board_games = board_game_data_api_downloader.fetch_with_offset(
                offset=offset
            )

            offset += api_params.API_DATA_LIMIT

            for api_board_game in api_board_games:
                try:
                    board_game = BoardGame.objects.filter(description__exact=api_board_game[api_params.DESCRIPTION]).get()
                    api_v2_game_ids = board_game_data_api_downloader.fetch_with_ids(
                        [api_board_game[api_params.OBJECT_ID]],
                        api_fields=[api_params.TYPE],
                        api_url=api_params.BASE_API_URL_V2,
                    )

                    if not api_v2_game_ids:
                        (log_error_creator
                            .create()
                            .warning()
                            .log(
                                message=f'Not found: API ID - {api_board_game[api_params.OBJECT_ID]}, {board_game.name}',
                                trigger='GameNotFound',
                                class_reference='cleanup_board_games'
                            ))
                        continue

                    if api_v2_game_ids[0] and api_v2_game_ids[0][api_params.TYPE] not in ('boardgame', 'boardgameexpansion'):
                        board_game.delete()
                        removed_games += 1
                        continue

                    if api_board_game['name'] and board_game.name != api_board_game['name']:
                        board_game.name = api_board_game['name']
                        board_game.save()
                        changed_names += 1

                except ObjectDoesNotExist:
                    (log_error_creator
                        .create()
                        .warning()
                        .log(
                            message=f'{api_board_game[api_params.OBJECT_ID]};{api_board_game[api_params.NAME]}',
                            trigger='ObjectDoesNotExist',
                            class_reference='cleanup_board_games'
                        ))
                    continue

                except MultipleObjectsReturned:
                    (log_error_creator
                        .create()
                        .warning()
                        .log(
                            message=f'{api_board_game[api_params.OBJECT_ID]};{api_board_game[api_params.NAME]}',
                            trigger='MultipleObjectsReturned',
                            class_reference='cleanup_board_games'
                        ))
                    continue
