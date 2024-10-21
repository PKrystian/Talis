import pytest

from app.utils.photon_api.PhotonAPILocationMatcher import PhotonAPILocationMatcher


class TestPhotonAPILocationMatcher:
    photon_api_location_matcher: PhotonAPILocationMatcher

    def setup_class(self):
        self.photon_api_location_matcher = PhotonAPILocationMatcher()

    @pytest.mark.parametrize(
        'city, street, zip_code, expected',
        [
            ('Berlin', 'Leipziger Str. 50.', '10117', {
                'latitude': 52.5107828,
                'longitude': 13.400859258037851,
            }),
            ('London', '7 Church Rd', 'SW13 9HE', {
                'latitude': 51.4734842,
                'longitude': -0.2473424,
            }),
            ('Montbard', '7 Rue Auguste Carré', '21500', {
                'latitude': 47.6255244,
                'longitude': 4.3395884,
            }),
            ('Gołuchów', 'Ulica Działyńskich 2', '63-322', {
                'latitude': 51.851496,
                'longitude': 17.9307447,
            }),
            ('', '', '', None),
        ]
    )
    def test_get_lat_long_for_address(self, city, street, zip_code, expected):
        result = self.photon_api_location_matcher.get_lat_long_for_address(
            city,
            street,
            zip_code
        )

        assert(result == expected)
