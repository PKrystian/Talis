from django.core.management.base import BaseCommand, CommandError
import pandas as pd

from app.utils.BoardGameCreator import BoardGameCreator


class Command(BaseCommand):
    help: str = 'Imports board game data to the database'

    def add_arguments(self, parser) -> None:
        parser.add_argument('limit', nargs='+', type=int, help='limit (0 = all data)')

    def handle(self, *args, **kwargs) -> None:
        self.stdout.write('Importing board games...')

        limit = kwargs['limit'][0]
        dataset = pd.read_csv('final_board_game_dataset.csv')

        if limit == 0 or limit > len(dataset):
            limit = len(dataset)

        for i in range(limit):
            self.stdout.write(f'Importing game number {i}')
            board_game_df = dataset.iloc[i]
            board_game = BoardGameCreator.create_from_dataframe(board_game_df)
            board_game.save()

        self.stdout.write(self.style.SUCCESS('Successfully imported all data!'))
