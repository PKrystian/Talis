import requests


def test_bgg_api_connection():
        response = requests.get('https://api.geekdo.com/xmlapi/')
        assert(response.status_code == 200)
