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
ID_FIELD_PARAM = '@id'
TOTAL_COUNT_FIELD_PARAM = '@total'

# Main xml field names
BASE_XML_PARAM = 'boardgames'
BOARDGAME_XML_PARAM = 'boardgame'

# Search field names
BASE_XML_SEARCH_PARAM = 'items'
SUB_XML_SEARCH_PARAM = 'item'

BASE_API_URL = 'https://api.geekdo.com/xmlapi/boardgame/'
BASE_API_SEARCH_URL = 'https://boardgamegeek.com/xmlapi2/search'
API_DATA_LIMIT = 99

# Boardgame fetch params
ADDITIONAL_URL_PARAM_STATS = '?stats=1'

# Search params
ADDITIONAL_URL_SEARCH_PARAM_EXACT = '&exact=1'
ADDITIONAL_URL_SEARCH_PARAM_TYPE = '?type='
ADDITIONAL_URL_SEARCH_PARAM_QUERY = '?query='

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
