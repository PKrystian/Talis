import json

from django.contrib.auth.models import User
from django.db.models import Q
from django.http import JsonResponse
from pandas.core.methods.to_dict import to_dict

from app.models import BoardGame, Category
from app.models.event import Event
from app.models.invite import Invite
from app.utils.EventFilterQuery import EventFilter
from app.utils.creators.EventCreator import EventCreator
from app.utils.photon_api.PhotonAPILocationMatcher import PhotonAPILocationMatcher


class EventController:
    BASE_ROUTE: str = 'event/'

    ROUTE_GET: str = BASE_ROUTE + 'get/'

    @staticmethod
    def action_get_events() -> JsonResponse:
        events = Event.objects.all().order_by(Event.EVENT_START_DATE).all()
        data = []

        for event in events:
            if event.attendees.count() < event.max_players:
                data.append(event.serialize())

        return JsonResponse(
            data=data,
            status=200,
            safe=False
            )
    
    ROUTE_NEW: str = BASE_ROUTE + 'new/'

    def action_new_event(self, request) -> JsonResponse:
        event_creator = EventCreator()
        photon_api_location_matcher = PhotonAPILocationMatcher()

        request_form_data = request.POST
        form_data = dict()
        many_to_many_fields = dict()
        invited_friend_ids = []

        for key in request_form_data.keys():
            if key == Event.BOARD_GAMES or key == Event.TAGS:
                if request_form_data[key]:
                    many_to_many_fields[key] = json.loads(request_form_data[key])
            elif key == Invite.INVITED_FRIENDS:
                invited_friend_ids = json.loads(request_form_data[key])
            else:
                form_data[key] = request_form_data[key]

        form_data[Event.HOST] = self.__parse_host(int(form_data[Event.HOST]))
        form_data[Event.COORDINATES] = photon_api_location_matcher.get_lat_long_for_address(
            form_data[Event.CITY],
            form_data[Event.STREET],
            form_data[Event.ZIP_CODE],
        )

        if Event.BOARD_GAMES in many_to_many_fields.keys():
            many_to_many_fields[Event.BOARD_GAMES] = self.__parse_board_games(many_to_many_fields[Event.BOARD_GAMES])
        if Event.TAGS in many_to_many_fields.keys():
            many_to_many_fields[Event.TAGS] = self.__parse_categories(many_to_many_fields[Event.TAGS])

        new_event = (
            event_creator
            .create()
            .load_from_dict(form_data)
            .get_event()
        )

        new_event.save()

        if Event.BOARD_GAMES in many_to_many_fields.keys():
            new_event.set_board_games(many_to_many_fields[Event.BOARD_GAMES])
        if Event.TAGS in many_to_many_fields.keys():
            new_event.set_tags(many_to_many_fields[Event.TAGS])

        new_event.save()

        if invited_friend_ids:
            self.__generate_friend_invites(invited_friend_ids, new_event)

        return JsonResponse(
            data={
                'detail': 'Event created successfully!',
            },
            status=200
        )

    @staticmethod
    def __parse_host(user_id: int) -> list:
        return User.objects.filter(id__exact=user_id).get()

    @staticmethod
    def __parse_board_games(board_game_ids: list) -> list:
        return BoardGame.objects.filter(id__in=board_game_ids).all()

    @staticmethod
    def __parse_categories(category_names: list) -> list:
        return Category.objects.filter(name__in=category_names).all()

    @staticmethod
    def __generate_friend_invites(invited_friend_ids: list, event: Event) -> None:
        for invited_friend_id in invited_friend_ids:
            Invite.objects.create(
                user=event.host,
                invited_user_id=invited_friend_id,
                event=event,
                type=Invite.INVITE_TYPE_EVENT,
                status=Invite.INVITE_STATUS_PENDING,
            )

    ROUTE_JOIN = BASE_ROUTE + 'ask-to-join/'

    @staticmethod
    def action_ask_to_join_event(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        event_id = request.POST.get('event_id')

        event = Event.objects.get(id=event_id)

        if event.attendees.count() == event.max_players:
            return JsonResponse(
               data={'detail': 'Event already full'},
               status=200
            )

        Invite.objects.create(
            user_id=user_id,
            invited_user = event.host,
            event=event,
            type=Invite.INVITE_TYPE_EVENT_JOIN_REQUEST,
            status=Invite.INVITE_STATUS_PENDING,
        )

        return JsonResponse(
            data={'detail': 'Succesfully asked to join event'},
            status=200
        )

    ROUTE_USER_RELIANT_EVENTS = BASE_ROUTE + 'user-events/'

    @staticmethod
    def action_get_user_reliant_events(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        user = User.objects.filter(id=user_id).get()

        events = Event.objects.filter(Q(host_id=user_id) | Q(attendees__exact=user)).order_by(Event.EVENT_START_DATE)

        data = []

        for event in events:
            if event.attendees.count() < event.max_players:
                data.append(event.serialize())

        return JsonResponse(
            data=data,
            status=200,
            safe=False
            )

    ROUTE_GET_FILTERED = BASE_ROUTE + 'get-filtered/'

    @staticmethod
    def action_get_filtered_events(user_id: int, filters: dict) -> JsonResponse:
        event_filter = EventFilter(user_id)

        events = event_filter.create_event_query_with_filters(filters).order_by('event_start_date').all()

        data = []

        for event in events:
            if event.attendees.count() < event.max_players:
                data.append(event.serialize())

        return JsonResponse(
            data=data,
            status=200,
            safe=False
        )
