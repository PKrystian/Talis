import pytest

from app.utils.bgg_api import bgg_api_params
from app.utils.bgg_api.BoardGameAPIDataDownloader import BoardGameDataAPIDownloader


class TestBoardGameAPIDataDownloader:
    board_game_data_api_downloader: BoardGameDataAPIDownloader

    def setup_class(self):
        self.board_game_data_api_downloader = BoardGameDataAPIDownloader()

    @pytest.mark.parametrize(
        'api_fields, limit, offset',
        [
            (bgg_api_params.ALL_FIELDS, 10, 0),
            ([bgg_api_params.NAME, bgg_api_params.DESCRIPTION], 15, 0),
            ([bgg_api_params.YEAR_PUBLISHED, bgg_api_params.MIN_PLAYERS, bgg_api_params.MAX_PLAYERS], 20, 0),
        ]
    )
    def test_fetch_with_offset(self, api_fields, limit, offset):
        results = self.board_game_data_api_downloader.fetch_with_offset(
            api_fields=api_fields,
            limit=limit,
            offset=offset,
        )

        assert(type(results[0]) == dict)
        assert(len(results) == limit)
        assert(all(key in results[0].keys() for key in api_fields))

    @pytest.mark.parametrize(
        'game_ids, api_fields',
        [
            (['1', '2', '3', '4', '5', '6'], bgg_api_params.ALL_FIELDS),
            ([1, 2, 3, 4, 5, 6], bgg_api_params.ALL_FIELDS),
            ([6, 2, 3, 1, 4], bgg_api_params.ALL_FIELDS),
        ]
    )
    def test_fetch_with_ids(self, game_ids, api_fields):
        results = self.board_game_data_api_downloader.fetch_with_ids(
            game_ids=game_ids,
            api_fields=api_fields,
        )

        assert(type(results[0]) == dict)
        assert(len(results) == len(game_ids))

        for result in results:
            assert(all(key in result.keys() for key in api_fields))

    def test_get_ids_from_search(self, actual_board_game_fixture):
        results = self.board_game_data_api_downloader.get_ids_from_search(
            [actual_board_game_fixture]
        )

        assert(len(results) == 1)
        assert(results[0] == '1')
