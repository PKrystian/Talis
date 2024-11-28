import urllib.parse
from django.http import JsonResponse
from app.models import BoardGame, BoardGameCategory
from django.db.models import Q, Count
from app.utils.creators.LogErrorCreator import LogErrorCreator


class SearchController:
    ROUTE: str = 'search/'

    BIG_LIMIT: int = 48
    MEDIUM_LIMIT: int = 24
    SMALL_LIMIT: int = 5

    AGE_RANGES = {
        'up to 3 years': (0, 3),
        '3-4 years': (3, 4),
        '5-7 years': (5, 7),
        '8-11 years': (8, 11),
        '12-14 years': (12, 14),
        '15-17 years': (15, 17),
        '18+ years': (18, 0),
    }

    PLAYTIME_RANGES = {
        '< 15 min': (0, 15),
        '< 30 min': (0, 30),
        '< 1h': (0, 60),
        '< 2h': (0, 120),
        '2h+': (120, 0),
    }

    def action_search_board_games(self, query: str, limit: int, page: int, query_params: dict) -> JsonResponse:
        try:
            combined_filters = query_params.get('filters[]', [])
            sort_by = query_params.get('sort', ['rating_desc'])[0]
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
                elif 'excluded|' in combined_filter:
                    exclude_filter = combined_filter.replace('excluded|', '')
                    if exclude_filter == 'no_expansions':
                        board_games = board_games.exclude(boardgamecategory__category_id=BoardGameCategory.CATEGORY_EXPANSION)
                    elif exclude_filter == 'no_rating':
                        board_games = board_games.exclude(rating=0)
                    elif exclude_filter == 'no_image':
                        board_games = board_games.exclude(image_url__isnull=True)
                    elif exclude_filter == 'no_age':
                        board_games = board_games.exclude(age=0)
                    elif exclude_filter == 'no_playtime':
                        board_games = board_games.exclude(min_playtime=0)
                    elif exclude_filter == 'no_categories':
                        board_games = board_games.exclude(boardgamecategory__isnull=True)
                    elif exclude_filter == 'no_mechanics':
                        board_games = board_games.exclude(boardgamemechanic__isnull=True)
                    elif exclude_filter == 'no_year':
                        board_games = board_games.exclude(year_published__isnull=True)
                else:
                    filter_type, filter_value = combined_filter.split('|', 1)
                    filter_value = urllib.parse.unquote(filter_value)
                    filter_type_to_field = {
                        'category': 'boardgamecategory__category__name__icontains',
                        'mechanic': 'boardgamemechanic__mechanic__name__icontains',
                        'age': 'age',
                        'playtime': 'min_playtime',
                    }
                    if filter_type == 'age':
                        age_min, age_max = self.AGE_RANGES[filter_value]
                        if age_max == 0:
                            board_games = board_games.filter(age__gte=age_min)
                        elif age_min == 0:
                            board_games = board_games.filter(age__lte=age_max)
                        else:
                            board_games = board_games.filter(age__gte=age_min, age__lte=age_max)
                    elif filter_type == 'playtime':
                        playtime_min, playtime_max = self.PLAYTIME_RANGES[filter_value]
                        if playtime_max == 0:
                            board_games = board_games.filter(min_playtime__gte=playtime_min)
                        elif playtime_min == 0:
                            board_games = board_games.filter(min_playtime__lte=playtime_max)
                        else:
                            board_games = board_games.filter(min_playtime__gte=playtime_min, min_playtime__lte=playtime_max)
                    elif filter_type == 'publisher':
                        board_games = board_games.filter(
                            boardgamepublisher__publisher__name__icontains=filter_value
                        )
                    elif filter_type == 'year':
                        board_games = board_games.filter(year_published=filter_value)
                    else:
                        board_games = board_games.filter(**{filter_type_to_field[filter_type]: filter_value})

            sort_mapping = {
                'rating_desc': '-rating',
                'rating_asc': 'rating',
                'name_asc': 'name',
                'name_desc': '-name',
                'year_desc': '-year_published',
                'year_asc': 'year_published',
            }

            order_by_field = sort_mapping.get(sort_by, '-rating')
            board_games = board_games.order_by(order_by_field)[offset:offset + limit]

            data = [{
                'id': game.id,
                'name': game.name,
                'image_url': game.image_url,
                'category': ', '.join([bc.category.name for bc in game.boardgamecategory_set.all()]),
                'rating': game.rating,
                'added_by': game.added_by.id if game.added_by else None,
                'accepted_by_admin': game.accepted_by_admin,
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
