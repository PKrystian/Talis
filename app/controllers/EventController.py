from django.http import JsonResponse

from app.models.event import Event


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
        # process POST data here and create new event instance
        return JsonResponse()
