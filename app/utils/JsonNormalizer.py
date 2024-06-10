import json


class JsonNormalizer:
    @staticmethod
    def normalize_from_string(string: str) -> list:
        string = string.strip('"[]"')
        string = string.strip("''")
        result = string.split("', '")

        return result
