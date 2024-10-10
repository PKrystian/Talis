import pytest

from app.utils.JsonNormalizer import JsonNormalizer


class TestJsonNormalizer:
    json_normalizer: JsonNormalizer

    def setup_class(self):
        self.json_normalizer = JsonNormalizer()

    @pytest.mark.parametrize(
        'test_string, expected',
        [
            ("'Card Game', 'Sports Game'", ['Card Game', 'Sports Game']),
            ('"[Spies/Secret Agents, Real-time]"', ['Spies/Secret Agents, Real-time']),
            ('"Real-time"', ['Real-time']),
            ('[Industry / Manufacturing]', ['Industry / Manufacturing']),
            ("'Abstract Strategy', 'Sports Game', 'Card Game'", ['Abstract Strategy', 'Sports Game', 'Card Game']),
            ('[Print & Play', ['Print & Play']),
        ]
    )
    def test_normalize_from_string(self, test_string, expected):
        result = self.json_normalizer.normalize_from_string(test_string)
        assert(result == expected)
