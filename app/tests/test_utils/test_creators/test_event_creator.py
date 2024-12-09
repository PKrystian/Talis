import pytest

from app.models.event import Event
from app.utils.creators.EventCreator import EventCreator


class TestEventCreator:
    event_creator: EventCreator

    def setup_class(self):
        self.event_creator = EventCreator()

    @pytest.fixture
    def event_dict_fixture(self, new_registered_user_fixture):
        new_registered_user_fixture.save()

        yield {
            Event.TITLE: 'Test Event Title',
            Event.HOST: new_registered_user_fixture.user,
            Event.CITY: 'test_city',
            Event.ZIP_CODE: 'test_zip_code',
            Event.STREET: 'test_street',
            Event.DESCRIPTION: 'Description for test event',
            Event.MAX_PLAYERS: 10,
            Event.EVENT_START_DATE: '2028-12-12',
            Event.COORDINATES: (11.235898, 10.213989),
        }

    @pytest.mark.django_db
    def test_load_from_dict(self, event_dict_fixture):
        event = (
            self.event_creator
                .create()
                .load_from_dict(event_dict_fixture)
                .get_event()
        )

        assert(event.title == event_dict_fixture[Event.TITLE])
