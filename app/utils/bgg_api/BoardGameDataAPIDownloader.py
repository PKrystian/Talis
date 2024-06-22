import requests
import xmltodict
from typing import List

from app.models.board_game import BoardGame
from app.utils.bgg_api import api_params
from app.utils.bgg_api.BoardGameAPIDataMapper import BoardGameAPIDataMapper


class BoardGameDataAPIDownloader:
    __board_game_data_mapper: BoardGameAPIDataMapper

    URL_GAME_ID_SEPARATOR = ','
    __API_FETCH_MAX_TRIES = 10

    def __init__(self) -> None:
        self.__board_game_data_mapper = BoardGameAPIDataMapper()

    def __fetch(
        self,
        api_fields: list,
        url: str
    ) -> list:
        dict_response = self.__send_and_parse_request(url)

        data = dict_response[api_params.BASE_XML_PARAM][api_params.BOARDGAME_XML_PARAM]

        if data is not list:
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
            api_fields: list = api_params.ALL_FIELDS,
            limit: int = api_params.API_DATA_LIMIT,
            offset: int = 0,
    ) -> list:
        if not limit:
            return []

        extra_url_params = None
        game_ids = self.__create_id_string_for_fetch(limit, offset)

        if api_params.STATISTICS in api_fields:
            extra_url_params = api_params.ADDITIONAL_URL_PARAM_STATS

        url = self.__setup_url(api_params.BASE_API_URL, game_ids, extra_url_params)

        return self.__fetch(api_fields, url)

    def __create_id_string_for_fetch(self, limit: int, offset: int) -> str:
        ids = list(range(offset + 1, offset + limit + 1))
        ids = [str(id_elem) for id_elem in ids]

        return self.URL_GAME_ID_SEPARATOR.join(ids)

    def fetch_with_ids(
        self,
        game_ids: list,
        api_fields: list = api_params.ALL_FIELDS,
    ) -> list:
        if len(game_ids) <= 0:
            return []

        if game_ids[0] is not str:
            game_ids = [str(game_id) for game_id in game_ids]

        if len(game_ids) < api_params.API_DATA_LIMIT:
            until = api_params.API_DATA_LIMIT + 1
        else:
            until = len(game_ids)

        parsed_games_list = []

        for offset in range(api_params.API_DATA_LIMIT, until, api_params.API_DATA_LIMIT):
            game_ids = game_ids[:offset]

            game_ids = self.URL_GAME_ID_SEPARATOR.join(game_ids)

            extra_url_params = None

            if api_params.STATISTICS in api_fields:
                extra_url_params = api_params.ADDITIONAL_URL_PARAM_STATS

            url = self.__setup_url(api_params.BASE_API_URL, game_ids, extra_url_params)

            parsed_games_list.extend(self.__fetch(api_fields, url))

        return parsed_games_list

    def get_ids_from_search(self, board_games: List[BoardGame]) -> list:
        game_ids = []
        separator = '+'

        for board_game in board_games:
            url = (api_params.BASE_API_SEARCH_URL
                   + api_params.ADDITIONAL_URL_SEARCH_PARAM_QUERY
                   + board_game.get_name().replace(' ', separator)
                   + api_params.ADDITIONAL_URL_SEARCH_PARAM_EXACT
                   )

            dict_response = self.__send_and_parse_request(url)

            if api_params.BASE_XML_SEARCH_PARAM in dict_response.keys():
                items = dict_response[api_params.BASE_XML_SEARCH_PARAM]
            else:
                continue

            if int(items[api_params.TOTAL_COUNT_FIELD_PARAM]) == 0:
                continue

            data = items[api_params.SUB_XML_SEARCH_PARAM]

            game_id = 0

            if type(data) is list:
                for potential_game in data:
                    potential_game_id = potential_game[api_params.ID_FIELD_PARAM]

                    params_to_match = self.fetch_with_ids(
                        game_ids=[potential_game_id],
                        api_fields=[api_params.NAME, api_params.DESCRIPTION]
                    )[0]

                    match_name = params_to_match[api_params.NAME]
                    match_description = params_to_match[api_params.DESCRIPTION]

                    if (match_name and (board_game.get_name() == match_name)) and (match_description and (board_game.get_description() == match_description)):
                        game_id = potential_game_id
                        break

            else:
                game_id = data[api_params.ID_FIELD_PARAM]

            if game_id:
                game_ids.append(game_id)

        return game_ids

    def __send_and_parse_request(self, url: str) -> dict:
        number_of_tries = 1

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

        xml_response = response.text

        return xmltodict.parse(xml_response)

    @staticmethod
    def __setup_url(base_url: str, url_ids: str, extra_url_params: list | None) -> str:
        url = base_url + url_ids

        if not extra_url_params:
            return url

        separator = ''
        extra_params = separator.join(extra_url_params)

        url += extra_params

        return url
