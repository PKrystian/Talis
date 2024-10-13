import pytest

from app.utils.bgg_api import bgg_api_params
from app.utils.bgg_api.BoardGameAPIDataMapper import BoardGameAPIDataMapper


class TestBoardGameAPIDataMapper:
    board_game_api_data_mapper: BoardGameAPIDataMapper

    def setup_class(self):
        self.board_game_api_data_mapper = BoardGameAPIDataMapper()

    @pytest.fixture
    def board_game_json_response_fixture(self):
       return {
         "@objectid":"1",
         "yearpublished":"1986",
         "minplayers":"3",
         "maxplayers":"5",
         "playingtime":"240",
         "minplaytime":"240",
         "maxplaytime":"240",
         "age":"14",
         "name":[
         {
           "@primary":"true",
           "@sortindex":"5",
           "#text":"Die Macher"
         },
         {
           "@sortindex":"1",
           "#text":"德国大选"
         },
         {
           "@sortindex":"1",
           "#text":"디 마허"
         }
         ],
         "description":"Die Macher is a game about seven sequential political races in different regions of Germany. Players are in charge of national political parties, and must manage limited resources to help their party to victory. The winning party will have the most victory points after all the regional elections. There are four different ways of scoring victory points. First, each regional election can supply one to eighty victory points, depending on the size of the region and how well your party does in it. Second, if a party wins a regional election and has some media influence in theregion, then the party will receive some media-control victory points. Third, each party has a national party membership which will grow as the game progresses and this will supply a fair number of victory points. Lastly, parties score some victory points if their party platform matches the national opinions at the end of the game.<br/><br/>The 1986 edition featured four parties from the old West Germany and supported 3-4 players. The 1997 edition supports up to five players in the re-united Germany and updated several features of the rules as well.  The 2006 edition also supports up to five players and adds a shorter five-round variant and additional rules updates by the original designer.<br/><br/>",
         "thumbnail":"https://cf.geekdo-images.com/rpwCZAjYLD940NWwP3SRoA__thumb/img/YT6svCVsWqLrDitcMEtyazVktbQ=/fit-in/200x150/filters:strip_icc()/pic4718279.jpg",
         "image":"https://cf.geekdo-images.com/rpwCZAjYLD940NWwP3SRoA__original/img/yR0aoBVKNrAmmCuBeSzQnMflLYg=/0x0/filters:format(jpeg)/pic4718279.jpg",
         "boardgamepublisher":[
         {
           "@objectid":"133",
           "#text":"Hans im Glück"
         },
         {
           "@objectid":"2",
           "#text":"Moskito Spiele"
         },
         {
           "@objectid":"24883",
           "#text":"Ediciones MasQueOca"
         },
         {
           "@objectid":"2726",
           "#text":"Portal Games"
         },
         {
           "@objectid":"15108",
           "#text":"Spielworxx"
         },
         {
           "@objectid":"39249",
           "#text":"sternenschimmermeer"
         },
         {
           "@objectid":"11652",
           "#text":"Stronghold Games"
         },
         {
           "@objectid":"5382",
           "#text":"Valley Games, Inc."
         },
         {
           "@objectid":"8147",
           "#text":"YOKA Games"
         }
         ],
         "boardgamepodcastepisode":[
         {
           "@objectid":"448728",
           "#text":"[T’as joué à quoi au Week-End Proxi-Jeux ?] Édition 2022"
         },
         {
           "@objectid":"177525",
           "#text":"BGA Episode 100 - Top 100 Games of All Time"
         },
         {
           "@objectid":"86194",
           "#text":"BGTG 112 - Five-Player Games (with Dave O'Connor)"
         },
         {
           "@objectid":"101144",
           "#text":"BGTG136 - 100 Great Games, part 3 (with Stephen Glenn and Mark Jackson)"
         },
         {
           "@objectid":"3361",
           "#text":"BGWS 024 – Die Macher"
         },
         {
           "@objectid":"350891",
           "#text":"Ep 24- Top 3 Games From The 20th Century"
         },
         {
           "@objectid":"219134",
           "#text":"Episode 135 The Good, the Board, and the Old : Games released pre-1990"
         },
         {
           "@objectid":"299861",
           "#text":"Episode 23 – Jaws, Everdell, Kickstarters, News, and more"
         },
         {
           "@objectid":"370133",
           "#text":"Episode 28 -Negotiation Games"
         },
         {
           "@objectid":"175510",
           "#text":"Episode 31 - Top 50, Picks 40-31"
         },
         {
           "@objectid":"104630",
           "#text":"Episodio 11 – Especial verano 2013: Juegos no jugados"
         },
         {
           "@objectid":"61407",
           "#text":"Episodio 3 –Homínidos 2011 y entrevista a Pol Cors"
         },
         {
           "@objectid":"123206",
           "#text":"Heavy Cardboard Episode 3 – Die Macher"
         },
         {
           "@objectid":"170757",
           "#text":"Heavy Cardboard Episode 39 – Top 50 Favorite Games of Right Now"
         },
         {
           "@objectid":"187729",
           "#text":"Heavy Cardboard Episode 52 &ndash; Amanda&rsquo;s Top 50 &amp; Edward&rsquo;s Top 50"
         },
         {
           "@objectid":"194403",
           "#text":"Heavy Cardboard Episode 59 – December (2016) Briefing"
         },
         {
           "@objectid":"204382",
           "#text":"HLG 20: Dilemma's &amp; Path"
         },
         {
           "@objectid":"177491",
           "#text":"HLG 3: Explosief Materiaal"
         },
         {
           "@objectid":"76638",
           "#text":"House Rules 30: Die Macher, Die!"
         },
         {
           "@objectid":"115513",
           "#text":"Ludology Episode 76 - I Like Dice To Roll"
         },
         {
           "@objectid":"328918",
           "#text":"N°112 – Chroniques"
         },
         {
           "@objectid":"342182",
           "#text":"Round 6, Turn 7: \"Die Macher\" with Jesse"
         },
         {
           "@objectid":"101519",
           "#text":"Spiel des Jahres 2013"
         },
         {
           "@objectid":"152647",
           "#text":"The Good, The Board, and the Ugly Behaviors: Episode 20 “Dealing with Bad Players”"
         },
         {
           "@objectid":"7430",
           "#text":"The Messy Game Room Episode 3"
         },
         {
           "@objectid":"5619",
           "#text":"The Spiel #28 - Listener's Choice"
         }
         ],
         "boardgamehonor":[
         {
           "@objectid":"19702",
           "#text":"1998 Essener Feder Best Written Rules Winner"
         },
         {
           "@objectid":"8673",
           "#text":"1998 Spiel des Jahres Recommended"
         },
         {
           "@objectid":"18935",
           "#text":"2008 JoTa Best Monster Board Game Nominee"
         },
         {
           "@objectid":"18936",
           "#text":"2008 JoTa Best Monster Board Game Winner"
         }
         ],
         "boardgamemechanic":[
         {
           "@objectid":"2916",
           "#text":"Alliances"
         },
         {
           "@objectid":"2080",
           "#text":"Area Majority/ Influence"
         },
         {
           "@objectid":"2012",
           "#text":"Auction/Bidding"
         },
         {
           "@objectid":"2072",
           "#text":"Dice Rolling"
         },
         {
           "@objectid":"2040",
           "#text":"Hand Management"
         },
         {
           "@objectid":"2020",
           "#text":"Simultaneous Action Selection"
         }
         ],
         "boardgameartist":[
         {
           "@objectid":"928",
           "#text":"Bernd Brunnhofer"
         },
         {
           "@objectid":"12517",
           "#text":"Marcus Gschwendtner"
         },
         {
           "@objectid":"4959",
           "#text":"Harald Lieske"
         }
         ],
         "boardgameversion":[
         {
           "@objectid":"456543",
           "#text":"Chinese edition"
         },
         {
           "@objectid":"25164",
           "#text":"German-only first edition"
         },
         {
           "@objectid":"24939",
           "#text":"German-only second edition"
         },
         {
           "@objectid":"493943",
           "#text":"Korean edition"
         },
         {
           "@objectid":"24534",
           "#text":"Multilingual edition 2006"
         },
         {
           "@objectid":"502544",
           "#text":"Polish edition"
         },
         {
           "@objectid":"620076",
           "#text":"Spanish edition"
         },
         {
           "@objectid":"455802",
           "#text":"Spielworxx English/German edition"
         },
         {
           "@objectid":"459325",
           "#text":"Stronghold English/German edition"
         }
         ],
         "boardgamefamily":[
         {
           "@objectid":"10643",
           "#text":"Country: Germany"
         },
         {
           "@objectid":"81575",
           "#text":"Digital Implementations: VASSAL"
         },
         {
           "@objectid":"34116",
           "#text":"Political: Elections"
         },
         {
           "@objectid":"91",
           "#text":"Series: Classic Line (Valley Games)"
         }
         ],
         "boardgamecategory":[
         {
           "@objectid":"1021",
           "#text":"Economic"
         },
         {
           "@objectid":"1026",
           "#text":"Negotiation"
         },
         {
           "@objectid":"1001",
           "#text":"Political"
         }
         ],
         "cardset":{
         "@objectid":"89777",
         "#text":"Hans im Glück German 1st (1986) and 2nd (1997) eds; Valley Games English 3rd ed (2006)"
         },
         "boardgamedesigner":{
         "@objectid":"1",
         "#text":"Karl-Heinz Schmiel"
         },
         "boardgamesubdomain":{
         "@objectid":"5497",
         "#text":"Strategy Games"
         },
         "poll":[
         {
           "@name":"suggested_numplayers",
           "@title":"User Suggested Number of Players",
           "@totalvotes":"141",
           "results":[
              {
                 "@numplayers":"1",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"0"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"1"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"89"
                    }
                 ]
              },
              {
                 "@numplayers":"2",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"0"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"1"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"93"
                    }
                 ]
              },
              {
                 "@numplayers":"3",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"2"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"28"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"78"
                    }
                 ]
              },
              {
                 "@numplayers":"4",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"26"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"90"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"9"
                    }
                 ]
              },
              {
                 "@numplayers":"5",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"120"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"12"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"2"
                    }
                 ]
              },
              {
                 "@numplayers":"5+",
                 "result":[
                    {
                       "@value":"Best",
                       "@numvotes":"1"
                    },
                    {
                       "@value":"Recommended",
                       "@numvotes":"0"
                    },
                    {
                       "@value":"Not Recommended",
                       "@numvotes":"64"
                    }
                 ]
              }
           ]
         },
         {
           "@name":"language_dependence",
           "@title":"Language Dependence",
           "@totalvotes":"49",
           "results":{
              "result":[
                 {
                    "@level":"1",
                    "@value":"No necessary in-gametext",
                    "@numvotes":"37"
                 },
                 {
                    "@level":"2",
                    "@value":"Some necessary text - easily memorized or small crib sheet",
                    "@numvotes":"5"
                 },
                 {
                    "@level":"3",
                    "@value":"Moderate in-game text - needs crib sheet or paste ups",
                    "@numvotes":"7"
                 },
                 {
                    "@level":"4",
                    "@value":"Extensive use of text - massive conversion needed to be playable",
                    "@numvotes":"0"
                 },
                 {
                    "@level":"5",
                    "@value":"Unplayable in another language",
                    "@numvotes":"0"
                 }
              ]
           }
         },
         {
           "@name":"suggested_playerage",
           "@title":"User Suggested Player Age",
           "@totalvotes":"32",
           "results":{
              "result":[
                 {
                    "@value":"2",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"3",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"4",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"5",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"6",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"8",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"10",
                    "@numvotes":"0"
                 },
                 {
                    "@value":"12",
                    "@numvotes":"6"
                 },
                 {
                    "@value":"14",
                    "@numvotes":"19"
                 },
                 {
                    "@value":"16",
                    "@numvotes":"4"
                 },
                 {
                    "@value":"18",
                    "@numvotes":"2"
                 },
                 {
                    "@value":"21 and up",
                    "@numvotes":"1"
                 }
              ]
           }
         }
         ],
         "poll-summary":{
         "@name":"suggested_numplayers",
         "@title":"User Suggested Number of Players",
         "result":[
           {
              "@name":"bestwith",
              "@value":"Best with 5 players"
           },
           {
              "@name":"recommmendedwith",
              "@value":"Recommended with 4–5 players"
           }
         ]
         },
         "statistics":{
         "ratings":{
           "usersrated":"5829",
           "average":"7.59355",
           "bayesaverage":"7.02746",
           "ranks":{
              "rank":[
                 {
                    "@type":"subtype",
                    "@id":"1",
                    "@name":"boardgame",
                    "@friendlyname":"Board Game Rank",
                    "@value":"436",
                    "@bayesaverage":"7.02746"
                 },
                 {
                    "@type":"family",
                    "@id":"5497",
                    "@name":"strategygames",
                    "@friendlyname":"Strategy Game Rank",
                    "@value":"251",
                    "@bayesaverage":"7.16418"
                 }
              ]
           },
           "stddev":"1.56117",
           "median":"0",
           "owned":"8228",
           "trading":"282",
           "wanting":"501",
           "wishing":"2170",
           "numcomments":"2125",
           "numweights":"789",
           "averageweight":"4.3118"
         }
         }
         }

    def test_map_with_fields(self, board_game_json_response_fixture):
        result = self.board_game_api_data_mapper.map_with_fields(
           board_game=board_game_json_response_fixture,
           api_fields=bgg_api_params.ALL_FIELDS,
        )

        assert(type(result) == dict)
        assert(all(key in result.keys() for key in bgg_api_params.ALL_FIELDS))
