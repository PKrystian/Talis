from django.db.models import QuerySet

from app.models import FriendList
from app.models.event import Event


class EventFilter:
    EVENT_FILTER_STARTING_FROM = 'startingFrom'
    EVENT_FILTER_PLAYER_NUMBER_MIN = 'playerNumberMin'
    EVENT_FILTER_PLAYER_NUMBER_MAX = 'playerNumberMax'
    EVENT_FILTER_CREATED_BY_FRIENDS = 'createdByFriends'
    EVENT_FILTER_CATEGORIES = 'categories'

    __query: QuerySet
    __user_id: int

    __filter_map = {
        EVENT_FILTER_STARTING_FROM: lambda query, starting_from: query.filter(event_start_date__gte=starting_from),
        EVENT_FILTER_PLAYER_NUMBER_MIN: lambda query, player_min_limit: query.filter(max_players__gte=player_min_limit),
        EVENT_FILTER_PLAYER_NUMBER_MAX: lambda query, player_max_limit: query.filter(max_players__lte=player_max_limit),
        EVENT_FILTER_CREATED_BY_FRIENDS: lambda query, friend_ids: query.filter(host_id__in=friend_ids),
        EVENT_FILTER_CATEGORIES: lambda query, tags: query.filter(tags__name__in=tags),
    }

    def __init__(self, user_id):
        self.__user_id = user_id

    def create_event_query_with_filters(self, filters: dict):
        self.__query = Event.objects

        for filter_name, filter_value in filters.items():
            if filter_value:
                if filter_name == self.EVENT_FILTER_CREATED_BY_FRIENDS:
                    filter_value = self.__get_user_friend_ids_list()
                if filter_name in [self.EVENT_FILTER_PLAYER_NUMBER_MIN, self.EVENT_FILTER_PLAYER_NUMBER_MAX]:
                    if int(filter_value) <= 0:
                        continue
                self.__query = self.__get_event_filter_for_query(filter_name, filter_value)

        return self.__query.distinct()

    def __get_event_filter_for_query(self, filter_name, filter_value):
        return self.__filter_map[filter_name](self.__query, filter_value)

    def __get_user_friend_ids_list(self):
        return [friend['friend_id'] for friend in FriendList.objects.filter(user_id__exact=self.__user_id).values('friend_id')]
