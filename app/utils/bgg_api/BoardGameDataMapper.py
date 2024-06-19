from app.utils.bgg_api import api_params


class BoardGameDataMapper:
    def map_with_fields(self, board_game, api_fields: list) -> dict | None:
        if 'error' in board_game.keys():
            return None

        if len(board_game.keys()) == 0:
            return None

        board_game_dict = dict.fromkeys(api_fields, '')

        for field in api_fields:
            if field in board_game and board_game[field] != '':
                if field in api_params.ARRAY_FIELDS:
                    board_game_dict[field] = self.__extract_from_list(board_game[field])
                    continue

                if field in api_params.SINGLE_KEY_FIELDS:
                    board_game_dict[field] = self.__extract_name(board_game[field])
                    continue

                if field == api_params.STATISTICS:
                    board_game_dict[field] = self.__extract_rating(board_game[field])
                    continue

                board_game_dict[field] = board_game[field]

        return board_game_dict

    def __extract_from_list(self, board_game_key_list: list | dict) -> list:
        extracted_keys = []

        if isinstance(board_game_key_list, list):
            for key_element in board_game_key_list:
                clean_key_element = self.__clean_string(key_element[api_params.TEXT_FIELD_PARAM])
                extracted_keys.append(clean_key_element)
        else:
            clean_key_element = self.__clean_string(board_game_key_list[api_params.TEXT_FIELD_PARAM])
            extracted_keys.append(clean_key_element)

        return extracted_keys

    @staticmethod
    def __extract_name(board_game_names: list | dict) -> str:
        if isinstance(board_game_names, list):
            if '#text' in board_game_names[0].keys():
                return board_game_names[0][api_params.TEXT_FIELD_PARAM]
            else:
                for board_game_name in board_game_names:
                    if '#text' in board_game_name.keys():
                        return board_game_name[api_params.TEXT_FIELD_PARAM]
        else:
            return board_game_names[api_params.TEXT_FIELD_PARAM]

    @staticmethod
    def __extract_rating(statistics) -> float:
        rating = 0

        if api_params.RATINGS in statistics.keys():
            if api_params.BAYES_AVERAGE in statistics[api_params.RATINGS].keys():
                rating = statistics[api_params.RATINGS][api_params.BAYES_AVERAGE]

        return rating

    @staticmethod
    def __clean_string(extracted_string: str) -> str:
        extracted_string = extracted_string.strip()
        extracted_string = extracted_string.strip('"')
        extracted_string = extracted_string.strip("'")
        extracted_string = extracted_string.replace("'", '')
        extracted_string = extracted_string.replace('"', '')

        return extracted_string
