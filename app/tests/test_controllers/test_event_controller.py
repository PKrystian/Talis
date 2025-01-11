import json

import pytest

from app.controllers.EventController import EventController
from app.models.event import Event
from app.models.invite import Invite


class TestEventController:
    event_controller: EventController

    def setup_class(self):
        self.event_controller = EventController()

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_events(self, new_event_fixture):
        new_event_fixture.save()

        result = self.event_controller.action_get_events()
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_one_event(self, new_event_fixture):
        new_event_fixture.save()

        result = self.event_controller.action_get_one_event(new_event_fixture.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(type(data) == dict)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_new_event(self, new_registered_user_fixture):
        new_registered_user_fixture.save()

        event_dict = {
            Event.TITLE: 'Test Event Title',
            Event.HOST: new_registered_user_fixture.user.id,
            Event.CITY: 'test_city',
            Event.ZIP_CODE: 'test_zip_code',
            Event.STREET: 'test_street',
            Event.DESCRIPTION: 'Description for test event',
            Event.MAX_PLAYERS: 10,
            Event.EVENT_START_DATE: '2028-12-12',
            Event.COORDINATES: (11.235898, 10.213989),
        }

        result = self.event_controller.action_new_event(event_dict)

        events_count = Event.objects.count()

        assert(result.status_code == 200)
        assert(events_count == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_ask_to_join_event(self, new_registered_user_fixture, new_event_fixture):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        result = self.event_controller.action_ask_to_join_event(
            user_id=new_registered_user_fixture.id,
            event_id=new_event_fixture.id,
        )

        invites_count = Invite.objects.filter(
            user=new_registered_user_fixture.user,
            invited_user=new_event_fixture.host,
        ).count()

        assert(result.status_code == 200)
        assert(invites_count == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_user_reliant_events(self, new_registered_user_fixture, new_event_fixture):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        new_event_fixture.set_attendees([new_registered_user_fixture.user])
        new_event_fixture.save()

        result = self.event_controller.action_get_user_reliant_events(user_id=new_registered_user_fixture.id)
        data = json.loads(result.getvalue())

        print(data)

        assert(result.status_code == 200)
        assert(data[0]['title'] == new_event_fixture.title)
        assert(data[0]['attendees'][0]['email'] == new_registered_user_fixture.user.email)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_get_filtered_events(self, new_registered_user_fixture, new_event_fixture):
        new_registered_user_fixture.save()
        new_event_fixture.save()

        result = self.event_controller.action_get_filtered_events(user_id=new_registered_user_fixture.id, filters={})
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 1)

    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.django_db
    def test_action_remove_event(self, new_event_fixture):
        new_event_fixture.save()

        result = self.event_controller.action_remove_event(event_id=new_event_fixture.id)

        events_count = Event.objects.count()

        assert(result.status_code == 200)
        assert(events_count == 0)
