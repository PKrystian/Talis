# Main API parameters for fetching xml fields
NAME = 'name'
YEAR_PUBLISHED = 'yearpublished'
BOARD_GAME_PUBLISHER = 'boardgamepublisher'
BOARD_GAME_CATEGORY = 'boardgamecategory'
BOARD_GAME_MECHANIC = 'boardgamemechanic'
MIN_PLAYERS = 'minplayers'
MAX_PLAYERS = 'maxplayers'
AGE = 'age'
MIN_PLAYTIME = 'minplaytime'
MAX_PLAYTIME = 'maxplaytime'
BOARD_GAME_EXPANSION = 'boardgameexpansion'
DESCRIPTION = 'description'
IMAGE = 'image'
STATISTICS = 'statistics'

# Sub-fields of xml fields
RATINGS = 'ratings'
BAYES_AVERAGE = 'bayesaverage'

TEXT_FIELD_PARAM = '#text'

# Main xml field names
BASE_XML_PARAM = 'boardgames'
BOARDGAME_XML_PARAM = 'boardgame'

BASE_API_URL = 'https://api.geekdo.com/xmlapi/boardgame/'
API_DATA_LIMIT = 99

ADDITIONAL_URL_PARAM_STATS = '?stats=1'

ALL_FIELDS = [
    NAME,
    YEAR_PUBLISHED,
    BOARD_GAME_PUBLISHER,
    BOARD_GAME_CATEGORY,
    BOARD_GAME_MECHANIC,
    MIN_PLAYERS,
    MAX_PLAYERS,
    AGE,
    MIN_PLAYTIME,
    MAX_PLAYTIME,
    BOARD_GAME_EXPANSION,
    DESCRIPTION,
    IMAGE,
    STATISTICS,
]

SINGLE_KEY_FIELDS = [
    NAME,
    BOARD_GAME_PUBLISHER,
]

ARRAY_FIELDS = [
    BOARD_GAME_CATEGORY,
    BOARD_GAME_MECHANIC,
    BOARD_GAME_EXPANSION,
]
