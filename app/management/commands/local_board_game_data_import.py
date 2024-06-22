from django.core.management.base import BaseCommand, CommandError
import pandas as pd
import os
from zipfile import ZipFile

from app.utils.BoardGameCreator import BoardGameCreator


class Command(BaseCommand):
    help: str = 'Imports board game data to the database'
    DATASET_URL = 'mikoajbigaj/bgg-board-game-dataset'
    DATASET_ZIP = 'bgg-board-game-dataset.zip'
    FILE_NAME = 'final_board_game_dataset.csv'

    def add_arguments(self, parser) -> None:
        parser.add_argument('limit', nargs='+', type=int, help='limit (0 = all data)')

    def handle(self, *args, **kwargs) -> None:
        self.stdout.write('Importing board games...')

        limit = kwargs['limit'][0]

        os.system(f'kaggle datasets download -d {self.DATASET_URL}')

        with ZipFile(self.DATASET_ZIP, 'r') as zip_file:
            zip_file.extractall('./')

        os.remove(self.DATASET_ZIP)

        dataset = pd.read_csv(self.FILE_NAME)

        if limit == 0 or limit > len(dataset):
            limit = len(dataset)

        for i in range(limit):
            self.stdout.write(f'Importing game number {i}')
            board_game_df = dataset.iloc[i]

            board_game_creator = BoardGameCreator()
            board_game = (board_game_creator
                          .create()
                          .load_from_dataframe(board_game_df)
                          .get_board_game()
                          )
            board_game.save()

        os.remove(self.FILE_NAME)

        self.stdout.write(self.style.SUCCESS('Successfully imported all data!'))
