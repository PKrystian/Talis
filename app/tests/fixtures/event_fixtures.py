import pytest

from app.models.event import Event
from app.utils.creators.EventCreator import EventCreator
from app.utils.creators.RegisteredUserCreator import RegisteredUserCreator


@pytest.fixture
def new_event_fixture():
    event_creator = EventCreator()
    registered_user_creator = RegisteredUserCreator()

    new_user = (
        registered_user_creator
            .create()
            .set_first_name('Green')
            .set_last_name('Boy')
            .set_email('greenboy@mail.com')
            .set_password('zaq1@WSX')
            .set_birth_date('1998-12-12')
            .get_registered_user()
    )

    new_user.save()

    event_dict = {
        Event.TITLE: 'Test Event Title',
        Event.HOST: new_user.user,
        Event.CITY: 'test_city',
        Event.ZIP_CODE: 'test_zip_code',
        Event.STREET: 'test_street',
        Event.DESCRIPTION: 'Description for test event',
        Event.MAX_PLAYERS: 10,
        Event.EVENT_START_DATE: '2028-12-12',
        Event.COORDINATES: (11.235898, 10.213989),
    }

    return (
        event_creator
            .create()
            .load_from_dict(event_dict)
            .get_event()
    )
