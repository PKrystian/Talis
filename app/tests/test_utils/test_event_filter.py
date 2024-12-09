import pytest

from app.utils.EventFilter import EventFilter


class TestEventFilter:
    @pytest.mark.filterwarnings('ignore::RuntimeWarning')
    @pytest.mark.parametrize(
        'filters, expected_event_count',
        [
            ({EventFilter.EVENT_FILTER_CREATED_BY_FRIENDS: False}, 1),
            ({EventFilter.EVENT_FILTER_CREATED_BY_FRIENDS: True}, 0),
            ({EventFilter.EVENT_FILTER_PLAYER_NUMBER_MAX: 7}, 0),
            ({EventFilter.EVENT_FILTER_PLAYER_NUMBER_MAX: 12}, 1),
        ]
    )
    @pytest.mark.django_db
    def test_create_event_query_with_filters(self, new_registered_user_fixture, new_event_fixture, filters, expected_event_count):
        new_registered_user_fixture.save()
        new_event_fixture.save()
        event_filter = EventFilter(user_id=new_registered_user_fixture.user.id)

        filtered_events = event_filter.create_event_query_with_filters(filters)

        assert(len(filtered_events) == expected_event_count)
