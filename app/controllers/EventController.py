import json

from django.contrib.auth.models import User
from django.http import JsonResponse
from pandas.core.methods.to_dict import to_dict

from app.models import BoardGame, Category
from app.models.event import Event
from app.utils.creators.EventCreator import EventCreator
from app.utils.photon_api.PhotonAPILocationMatcher import PhotonAPILocationMatcher


class EventController:
    BASE_ROUTE: str = 'event/'

    ROUTE_GET: str = BASE_ROUTE + 'get/'

    def action_get_events(self) -> JsonResponse:
        events = Event.objects.all().order_by(Event.EVENT_START_DATE)[:20]
        return JsonResponse(
            [event.serialize() for event in events],
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

        for key in request_form_data.keys():
            if key == Event.BOARD_GAMES or key == Event.TAGS:
                if request_form_data[key]:
                    many_to_many_fields[key] = json.loads(request_form_data[key])
            else:
                form_data[key] = request_form_data[key]

        form_data[Event.HOST] = self.parse_host(int(form_data[Event.HOST]))
        form_data[Event.COORDINATES] = photon_api_location_matcher.get_lat_long_for_address(
            form_data[Event.CITY],
            form_data[Event.STREET],
            form_data[Event.ZIP_CODE],
        )

        if Event.BOARD_GAMES in form_data.keys():
            many_to_many_fields[Event.BOARD_GAMES] = self.parse_board_games(many_to_many_fields[Event.BOARD_GAMES])
        if Event.TAGS in form_data.keys():
            many_to_many_fields[Event.TAGS] = self.parse_categories(many_to_many_fields[Event.TAGS])

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

        return JsonResponse(
            data={
                'detail': 'Event created successfully!',
            },
            status=200
        )

    def parse_host(self, user_id: int) -> list:
        return User.objects.filter(id__exact=user_id).get()

    def parse_board_games(self, board_game_ids: list) -> list:
        return BoardGame.objects.filter(id__in=board_game_ids).all()

    def parse_categories(self, category_names: list) -> list:
        return Category.objects.filter(name__in=category_names).all()
