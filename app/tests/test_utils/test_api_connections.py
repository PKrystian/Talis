import requests


def test_bgg_api_connection():
        response = requests.get('https://api.geekdo.com/xmlapi/')
        assert(response.status_code == 200)


def test_photon_api_connection():
        response = requests.get('https://photon.komoot.io/api/?q')
        assert(response.status_code == 200)
