import requests
import xmltodict

from app.utils.bgg_api import api_params
from app.utils.bgg_api.BoardGameDataMapper import BoardGameDataMapper


class BoardGameDataDownloader:
    __api_url: str = api_params.BASE_API_URL
    __board_game_data_mapper: BoardGameDataMapper

    def __init__(self, base_api_url: str = None) -> None:
        if base_api_url:
            self.__base_api_url = base_api_url
        self.__board_game_data_mapper = BoardGameDataMapper()

    def fetch_from_api(
            self,
            api_fields: list = api_params.ALL_FIELDS,
            extra_url_params: list = None,
            limit: int = api_params.API_DATA_LIMIT,
            offset: int = 0,
    ) -> list:
        if not limit:
            return []

        ids = list(range(offset + 1, limit + 1))
        ids = [str(id_elem) for id_elem in ids]

        seperator = ','
        url_ids = seperator.join(ids)

        url = self.__setup_url(url_ids, extra_url_params)

        response = requests.get(url)

        if response.status_code != 200:
            raise ImportError

        xml_response = response.text
        dict_response = xmltodict.parse(xml_response)

        data = dict_response[api_params.BASE_XML_PARAM][api_params.BOARDGAME_XML_PARAM]

        parsed_games = []

        for board_game in data:
            parsed_games.append(self.__board_game_data_mapper.map_with_fields(board_game, api_fields))

        return parsed_games

    def __setup_url(self, url_ids: str, extra_url_params: list | None) -> str:
        url = self.__api_url + url_ids

        if not extra_url_params:
            return url

        separator = ''
        extra_params = separator.join(extra_url_params)

        url += extra_params

        return url
