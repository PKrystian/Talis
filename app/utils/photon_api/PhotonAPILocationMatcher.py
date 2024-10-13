import json
import requests
from app.utils.photon_api import photon_api_params


class PhotonAPILocationMatcher:
    __API_FETCH_MAX_TRIES = 3
    __RESPONSE_LIMIT = '1'

    def get_lat_long_for_address(self, city: str, street: str = '', zip_code: str = '') -> dict | None:
        url_params = [city]

        if street:
            url_params.append(street)
        if zip_code:
            url_params.append(zip_code)

        url = self.__prepare_url(url_params, True)

        json_response = self.__fetch(url)

        if not json_response[photon_api_params.FEATURES]:
            return None

        lat_long = json_response[photon_api_params.FEATURES][0][photon_api_params.GEOMETRY][photon_api_params.COORDINATES]

        coordinates = {
            'longitude': lat_long[0],
            'latitude': lat_long[1],
        }

        return coordinates


    def __prepare_url(self, params: list, with_limit: bool):
        base_url = photon_api_params.BASE_API_URL + photon_api_params.SEARCH_URL_PARAM_QUERY
        parsed_params = ''
        commas = len(params) - 1

        for param in params:
            parsed_params += param

            if commas:
                parsed_params += ','

            commas -= 1

        if with_limit:
            parsed_params += photon_api_params.SEARCH_URL_PARAM_LIMIT + self.__RESPONSE_LIMIT

        url = base_url + parsed_params

        return url

    def __fetch(self, url: str):
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
        
        return json.loads(response.text)
