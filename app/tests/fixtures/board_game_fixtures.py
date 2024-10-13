import pytest

from app.utils.creators.BoardGameCreator import BoardGameCreator
from app.utils.bgg_api import bgg_api_params


@pytest.fixture
def custom_board_game_fixture():
    board_game_dict = {
        bgg_api_params.NAME: 'Revolutionary Boardgame',
        bgg_api_params.YEAR_PUBLISHED: 1990,
        bgg_api_params.MIN_PLAYERS: 5,
        bgg_api_params.MAX_PLAYERS: 10,
        bgg_api_params.AGE: 13,
        bgg_api_params.MIN_PLAYTIME: 30,
        bgg_api_params.MAX_PLAYTIME: 90,
        bgg_api_params.DESCRIPTION: 'This game belonged to the beloved Queen Marika',
    }

    board_game_creator = BoardGameCreator()

    return (
        board_game_creator
        .create()
        .load_from_dict(board_game_dict)
        .get_board_game()
    )

@pytest.fixture
def actual_board_game_fixture():
    board_game_dict = {
        bgg_api_params.NAME: 'Die Macher',
        bgg_api_params.YEAR_PUBLISHED: 1986,
        bgg_api_params.MIN_PLAYERS: 3,
        bgg_api_params.MAX_PLAYERS: 5,
        bgg_api_params.AGE: 14,
        bgg_api_params.MIN_PLAYTIME: 240,
        bgg_api_params.MAX_PLAYTIME: 240,
        bgg_api_params.DESCRIPTION: 'Die Macher is a game about seven sequential political races in different regions of Germany. Players are in charge of national political parties, and must manage limited resources to help their party to victory. The winning party will have the most victory points after all the regional elections. There are four different ways of scoring victory points. First, each regional election can supply one to eighty victory points, depending on the size of the region and how well your party does in it. Second, if a party wins a regional election and has some media influence in the region, then the party will receive some media-control victory points. Third, each party has a national party membership which will grow as the game progresses and this will supply a fair number of victory points. Lastly, parties score some victory points if their party platform matches the national opinions at the end of the game.<br/><br/>The 1986 edition featured four parties from the old West Germany and supported 3-4 players. The 1997 edition supports up to five players in the re-united Germany and updated several features of the rules as well. The 2006 edition also supports up to five players and adds a shorter five-round variant and additional rules updates by the original designer.<br/><br/>',
    }

    board_game_creator = BoardGameCreator()

    return (
        board_game_creator
        .create()
        .load_from_dict(board_game_dict)
        .get_board_game()
    )
