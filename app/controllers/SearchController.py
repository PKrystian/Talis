from django.http import JsonResponse
from app.models import BoardGame, BoardGameCategory
from app.utils.creators.LogErrorCreator import LogErrorCreator


class SearchController:
    ROUTE: str = 'search/'

    BIG_LIMIT: int = 48
    MEDIUM_LIMIT: int = 18
    SMALL_LIMIT: int = 5

    AGE_RANGES = {
        'up to 3 years': (None, 3),
        '3-4 years': (3, 4),
        '5-7 years': (5, 7),
        '8-11 years': (8, 11),
        '12-14 years': (12, 14),
        '15-17 years': (15, 17),
        '18+ years': (18, None),
    }

    PLAYTIME_RANGES = {
        '< 15 min': (None, 15),
        '< 30 min': (None, 30),
        '< 1h': (None, 60),
        '< 2h': (None, 120),
        '2h+': (120, None),
    }

    def action_search_board_games(self, query, limit, page, query_params) -> JsonResponse:
        try:
            combined_filters = query_params.get('filters[]', [])
            if isinstance(combined_filters, list):
                combined_filters = [item for sublist in combined_filters for item in sublist]

            sort = query_params.get('sort', ['rating_desc'])[0]
            offset = (page - 1) * limit

            board_games = BoardGame.objects.exclude(rating__isnull=True)

            if query:
                board_games = board_games.filter(name__icontains=query)

            for combined_filter in combined_filters:
                if 'players|' in combined_filter:
                    min_players, max_players = combined_filter.replace('players|', '').split('-')
                    min_players = int(min_players) if min_players else None
                    max_players = int(max_players) if max_players else None
                    if min_players and max_players:
                        board_games = board_games.filter(min_players__lte=min_players, max_players__gte=max_players)
                    elif min_players:
                        board_games = board_games.filter(max_players__gte=min_players)
                    elif max_players:
                        board_games = board_games.filter(min_players__lte=max_players)
                else:
                    parts = combined_filter.split('|')
                    if len(parts) == 2:
                        filter_type, filter_value = parts
                        filter_type_to_field = {
                            'category': 'boardgamecategory__category__name__icontains',
                            'mechanic': 'boardgamemechanic__mechanic__name__icontains',
                            'age': 'age',
                            'playtime': 'min_playtime',
                        }
                        if filter_type == 'age':
                            age_min, age_max = self.AGE_RANGES[filter_value]
                            board_games = board_games.filter(age__gte=age_min, age__lte=age_max)
                        elif filter_type == 'playtime':
                            playtime_min, playtime_max = self.PLAYTIME_RANGES[filter_value]
                            board_games = board_games.filter(min_playtime__gte=playtime_min, min_playtime__lte=playtime_max)
                        elif filter_type == 'publisher':
                            board_games = board_games.filter(
                                boardgamepublisher__publisher__name__icontains=filter_value
                            )
                        elif filter_type == 'year':
                            board_games = board_games.filter(year_published=filter_value)
                        else:
                            board_games = board_games.filter(**{filter_type_to_field[filter_type]: filter_value})
                    else:
                        LogErrorCreator().create().warning().log(
                            message=f'Unexpected filter format: {combined_filter}',
                            trigger='action_search_board_games',
                            class_reference=self.__class__.__name__
                        )

            sort_field = {
                'rating_desc': '-rating',
                'rating_asc': 'rating',
                'name_asc': 'name',
                'name_desc': '-name',
                'year_desc': '-year_published',
                'year_asc': 'year_published',
            }.get(sort, '-rating')

            board_games = board_games.order_by(sort_field)[offset:offset + limit]

            data = [{
                'id': game.id,
                'name': game.name,
                'image_url': game.image_url,
                'category': ', '.join([bc.category.name for bc in game.boardgamecategory_set.all()]),
                'rating': game.rating,
                'is_expansion': game.boardgamecategory_set.filter(
                    category_id=BoardGameCategory.CATEGORY_EXPANSION).exists()
            } for game in board_games]

            return JsonResponse({'results': data}, status=200)

        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_search_board_games',
                class_reference=self.__class__.__name__
            )
            return JsonResponse({'error': str(e)}, status=500)
