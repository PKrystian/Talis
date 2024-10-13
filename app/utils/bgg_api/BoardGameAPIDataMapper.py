from app.utils.bgg_api import bgg_api_params
from langdetect import DetectorFactory, detect


class BoardGameAPIDataMapper:
    def __init__(self):
        DetectorFactory.seed = 0

    def map_with_fields(self, board_game, api_fields: list) -> dict | None:
        if 'error' in board_game.keys():
            return None

        print(board_game)

        if len(board_game.keys()) == 0:
            return None

        board_game_dict = dict.fromkeys(api_fields, '')

        for field in api_fields:
            if field in board_game and board_game[field] != '':
                if field in bgg_api_params.ARRAY_FIELDS:
                    board_game_dict[field] = self.__extract_from_list(board_game[field])
                    continue

                if field in bgg_api_params.SINGLE_KEY_FIELDS:
                    board_game_dict[field] = self.__extract_name(board_game[field])
                    continue

                if field == bgg_api_params.STATISTICS:
                    board_game_dict[field] = self.__extract_rating(board_game[field])
                    continue

                board_game_dict[field] = board_game[field]

        return board_game_dict

    def __extract_from_list(self, board_game_key_list: list | dict) -> list:
        extracted_keys = []

        if isinstance(board_game_key_list, list):
            for key_element in board_game_key_list:
                clean_key_element = self.__clean_string(key_element[bgg_api_params.TEXT_FIELD_PARAM])
                extracted_keys.append(clean_key_element)
        else:
            clean_key_element = self.__clean_string(board_game_key_list[bgg_api_params.TEXT_FIELD_PARAM])
            extracted_keys.append(clean_key_element)

        return extracted_keys

    def __extract_name(self, board_game_names: list | dict) -> str:
        if isinstance(board_game_names, list):
            primary_name = ''
            alternate_names = []
            for board_game_name in board_game_names:
                if {bgg_api_params.PRIMARY_NAME_FIELD_PARAM, bgg_api_params.TEXT_FIELD_PARAM}.issubset(board_game_name.keys()):
                    primary_name = board_game_name[bgg_api_params.TEXT_FIELD_PARAM]
                elif bgg_api_params.TEXT_FIELD_PARAM in board_game_name.keys():
                    alternate_names.append(board_game_name[bgg_api_params.TEXT_FIELD_PARAM])
            return self.__resolve_name(primary_name, alternate_names)
        else:
            return board_game_names[bgg_api_params.TEXT_FIELD_PARAM]

    @staticmethod
    def __extract_rating(statistics) -> float:
        rating = 0

        if bgg_api_params.RATINGS in statistics.keys():
            if bgg_api_params.BAYES_AVERAGE in statistics[bgg_api_params.RATINGS].keys():
                rating = statistics[bgg_api_params.RATINGS][bgg_api_params.BAYES_AVERAGE]

        return rating

    @staticmethod
    def __clean_string(extracted_string: str) -> str:
        extracted_string = extracted_string.strip()
        extracted_string = extracted_string.strip('"')
        extracted_string = extracted_string.strip("'")
        extracted_string = extracted_string.replace("'", '')
        extracted_string = extracted_string.replace('"', '')

        return extracted_string

    @staticmethod
    def __resolve_name(primary_name: str, alternate_names: list) -> str:
        try:
            if detect(primary_name) == 'en':
                return primary_name
        except Exception:
            return primary_name

        for alternate_name in alternate_names:
            try:
                if detect(alternate_name) == 'en':
                    return alternate_name
            except Exception:
                continue

        return primary_name
