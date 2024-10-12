import requests
import xmltodict
from typing import List

from app.models.board_game import BoardGame
from app.utils.bgg_api import bgg_api_params
from app.utils.bgg_api.BoardGameAPIDataMapper import BoardGameAPIDataMapper


class BoardGameDataAPIDownloader:
    __board_game_data_mapper: BoardGameAPIDataMapper

    __API_FETCH_MAX_TRIES = 10
    URL_GAME_ID_SEPARATOR = ','

    def __init__(self) -> None:
        self.__board_game_data_mapper = BoardGameAPIDataMapper()

    def __fetch(
        self,
        api_fields: list,
        url: str,
        use_new_version: bool = False,
    ) -> list:
        dict_response = self.__send_and_parse_request(url)

        if not dict_response:
            return []

        if not use_new_version:
            data = dict_response[bgg_api_params.BASE_XML_PARAM][bgg_api_params.BOARDGAME_XML_PARAM]
        else:
            data = dict_response[bgg_api_params.BASE_XML2_PARAM][bgg_api_params.ITEM_XML_PARAM]

        if type(data) is not list:
            data = [data]

        parsed_games = []

        for board_game in data:
            parsed_games.append(self.__board_game_data_mapper.map_with_fields(
                board_game,
                api_fields
            ))

        return parsed_games

    def fetch_with_offset(
            self,
            api_fields: list = bgg_api_params.ALL_FIELDS,
            limit: int = bgg_api_params.API_DATA_LIMIT,
            offset: int = 0,
    ) -> list:
        if not limit:
            return []

        extra_url_params = []
        game_ids = self.__create_id_string_for_fetch(limit, offset)

        if bgg_api_params.STATISTICS in api_fields:
            extra_url_params.append(bgg_api_params.ADDITIONAL_URL_PARAM_STATS)

        url = self.__setup_url(bgg_api_params.BASE_API_URL, game_ids, extra_url_params)

        return self.__fetch(api_fields, url)

    def __create_id_string_for_fetch(self, limit: int, offset: int) -> str:
        ids = list(range(offset + 1, offset + limit + 1))
        ids = [str(id_elem) for id_elem in ids]

        return self.URL_GAME_ID_SEPARATOR.join(ids)

    def fetch_with_ids(
        self,
        game_ids: list,
        api_fields: list = bgg_api_params.ALL_FIELDS,
        api_url: str = bgg_api_params.BASE_API_URL,
    ) -> list:
        if len(game_ids) <= 0:
            return []

        if game_ids[0] is not str:
            game_ids = [str(game_id) for game_id in game_ids]

        if len(game_ids) < bgg_api_params.API_DATA_LIMIT:
            until = bgg_api_params.API_DATA_LIMIT + 1
        else:
            until = len(game_ids)

        use_new_version = True
        if api_url == bgg_api_params.BASE_API_URL:
            use_new_version = False

        parsed_games_list = []

        for offset in range(bgg_api_params.API_DATA_LIMIT, until, bgg_api_params.API_DATA_LIMIT):
            game_ids = game_ids[:offset]

            game_ids = self.URL_GAME_ID_SEPARATOR.join(game_ids)

            extra_url_params = []

            if bgg_api_params.STATISTICS in api_fields:
                extra_url_params.append(bgg_api_params.ADDITIONAL_URL_PARAM_STATS)

            url = self.__setup_url(api_url, game_ids, extra_url_params)

            parsed_games_list.extend(self.__fetch(api_fields, url, use_new_version))

        return parsed_games_list

    def get_ids_from_search(self, board_games: List[BoardGame]) -> list:
        game_ids = []
        separator = '+'

        for board_game in board_games:
            url = (bgg_api_params.BASE_API_SEARCH_URL
                   + bgg_api_params.ADDITIONAL_URL_SEARCH_PARAM_QUERY
                   + board_game.get_name().replace(' ', separator)
                   + bgg_api_params.ADDITIONAL_URL_SEARCH_PARAM_EXACT
                   + bgg_api_params.ADDITIONAL_URL_SEARCH_PARAM_TYPE
                   )

            dict_response = self.__send_and_parse_request(url)

            if bgg_api_params.BASE_XML_SEARCH_PARAM in dict_response.keys():
                items = dict_response[bgg_api_params.BASE_XML_SEARCH_PARAM]
            else:
                continue

            if int(items[bgg_api_params.TOTAL_COUNT_FIELD_PARAM]) == 0:
                continue

            data = items[bgg_api_params.SUB_XML_SEARCH_PARAM]

            game_id = 0

            if type(data) is list:
                for potential_game in data:
                    potential_game_id = potential_game[bgg_api_params.ID_FIELD_PARAM]

                    params_to_match = self.fetch_with_ids(
                        game_ids=[potential_game_id],
                        api_fields=[bgg_api_params.NAME, bgg_api_params.DESCRIPTION]
                    )[0]

                    if not params_to_match:
                        continue

                    match_name = None
                    match_description = None

                    if bgg_api_params.NAME in params_to_match:
                        match_name = params_to_match[bgg_api_params.NAME]
                    if bgg_api_params.DESCRIPTION in params_to_match:
                        match_description = params_to_match[bgg_api_params.DESCRIPTION]

                    if (match_name and (board_game.get_name() == match_name)) and (match_description and (board_game.get_description() == match_description)):
                        game_id = potential_game_id
                        break

            else:
                game_id = data[bgg_api_params.ID_FIELD_PARAM]

            if game_id:
                game_ids.append(game_id)

        return game_ids

    def __send_and_parse_request(self, url: str) -> dict:
        number_of_tries = 1
        response = None

        for number_of_tries in range(1, self.__API_FETCH_MAX_TRIES):
            try:
                response = requests.get(url)
            except Exception:
                print(f'Retrying, {number_of_tries}')
                continue

            if response.status_code == 200:
                break

        if number_of_tries >= self.__API_FETCH_MAX_TRIES:
            raise Exception

        if not response:
            return dict()

        xml_response = response.text

        return xmltodict.parse(xml_response)

    @staticmethod
    def __setup_url(base_url: str, url_ids: str, extra_url_params: list) -> str:
        url = base_url + url_ids

        if not extra_url_params:
            return url

        separator = ''
        extra_params = separator.join(extra_url_params)

        url += extra_params

        return url
