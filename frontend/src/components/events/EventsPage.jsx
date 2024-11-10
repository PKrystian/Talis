import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PropTypes from 'prop-types';
import './EventsPage.css';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import EventItem from './EventItem';
import FilterConstants from '../../constValues/FilterConstants';
import EventTagsModal from './EventTagsModal';

const EventsPage = ({ apiPrefix, user }) => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenEvent, setChosenEvent] = useState(null);
  const [requestedEvents, setRequestedEvents] = useState(null);
  const [, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  const [startingFrom, setStartingFrom] = useState('');
  const [playerNumberMin, setPlayerNumberMin] = useState(0);
  const [playerNumberMax, setPlayerNumberMax] = useState(0);
  const [gameTags, setGameTags] = useState([]);
  const [onlyCreatedByFriends, setOnlyCreatedByFriends] = useState(false);

  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  const filterSetterMap = {
    [FilterConstants.EVENT_FILTER_STARTING_FROM]: setStartingFrom,
    [FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MIN]: setPlayerNumberMin,
    [FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MAX]: setPlayerNumberMax,
    [FilterConstants.EVENT_FILTER_CREATED_BY_FRIENDS]: setOnlyCreatedByFriends,
    [FilterConstants.EVENT_FILTER_CATEGORIES]: setGameTags,
  };

  const dateFormat = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  };

  const eventsUrl = apiPrefix + 'event/get/';
  const joinRequestsUrl = apiPrefix + 'invite/get-join-requests/';

  const fetchEventData = useCallback(async () => {
    if (!user || !user.user_id) {
      navigate('/');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(eventsUrl, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setEventData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, eventsUrl]);

  const fetchJoinRequests = () => {
    if (!user || !user.user_id) {
      navigate('/');
      return;
    }
    axios
      .post(
        joinRequestsUrl,
        { user_id: user.user_id },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then((resp) => {
        setRequestedEvents(resp.data);
      });
  };

  useEffect(() => {
    fetchEventData();
    fetchJoinRequests();
  }, []);

  useEffect(() => {
    if (descriptionRef.current) {
      const { clientHeight, scrollHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, []);

  const changeDisplayedEvent = (id) => {
    setChosenEvent(eventData.find((event) => event.id === id));
  };

  const onCreateEvent = () => {
    navigate('/create-event');
  };

  const handleAskToJoin = () => {
    axios
      .post(
        apiPrefix + 'event/ask-to-join/',
        {
          user_id: user.user_id,
          event_id: chosenEvent.id,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then(() => {
        fetchJoinRequests();
      });
  };

  const generateJoinButton = () => {
    const currentEventStatus = requestedEvents.find(
      (requestedEvent) => requestedEvent.event_id === chosenEvent.id,
    );

    if (
      chosenEvent.attendees.find((attendee) => attendee.id === user.user_id)
    ) {
      return (
        <button className="btn btn-success disabled">
          Signed up for event <FaCheck className="ms-2" />
        </button>
      );
    }

    if (
      !currentEventStatus ||
      (currentEventStatus && currentEventStatus.invite_status === 'rejected')
    ) {
      return (
        <button className="btn btn-primary" onClick={handleAskToJoin}>
          Ask to join
        </button>
      );
    }

    if (currentEventStatus.invite_status === 'pending') {
      return (
        <button className="btn btn-secondary disabled">
          Already sent request
        </button>
      );
    }
  };

  const handleOnFilterChange = (e) => {
    let id = e.target.id;
    let value = e.target.value;

    if (id == [FilterConstants.EVENT_FILTER_CREATED_BY_FRIENDS]) {
      value = e.target.checked;
    }

    filterSetterMap[id](value);
  };

  const onApplyFilters = () => {
    axios
      .get(`${apiPrefix}event/get-filtered/`, {
        params: {
          user_id: user.user_id,
          [FilterConstants.EVENT_FILTER_STARTING_FROM]: startingFrom,
          [FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MIN]: playerNumberMin,
          [FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MAX]: playerNumberMax,
          [FilterConstants.EVENT_FILTER_CATEGORIES]: JSON.stringify(gameTags),
          [FilterConstants.EVENT_FILTER_CREATED_BY_FRIENDS]:
            onlyCreatedByFriends ? onlyCreatedByFriends : '',
        },
      })
      .then((response) => {
        setEventData(response.data);
        if (response.data.length > 0) {
          setChosenEvent(response.data[0]);
        } else {
          setChosenEvent(null);
        }
      })
      .catch((error) => console.error('Error filtering events:', error));
  };

  const toggleTagsModal = () => {
    setIsTagsModalOpen((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="text-center vh-100 align-content-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container text-center navbar-expand-lg">
        <div className="container-fluid">
          <button
            className="navbar-toggler navbar-dark mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#meetingsFilter"
            aria-controls="meetingsFilter"
            aria-expanded="false"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="row border bg-black mt-3 mb-3 collapse navbar-collapse"
            id="meetingsFilter"
          >
            <div className="col-sm py-2 d-flex flex-column justify-content-center text-center">
              <label htmlFor="date-from">Events Starting From</label>
              <input
                id={[FilterConstants.EVENT_FILTER_STARTING_FROM]}
                className="date-input form-control align-self-center"
                value={startingFrom}
                onChange={handleOnFilterChange}
                type="datetime-local"
              />
            </div>
            <div className="col-sm py-2 d-flex flex-column">
              <div>No. of players</div>
              <span>
                <input
                  id={[FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MIN]}
                  className="number-input"
                  type="number"
                  min="1"
                  max={playerNumberMax}
                  value={playerNumberMin}
                  onChange={handleOnFilterChange}
                />{' '}
                to{' '}
                <input
                  id={[FilterConstants.EVENT_FILTER_PLAYER_NUMBER_MAX]}
                  className="number-input"
                  type="number"
                  min={playerNumberMin}
                  max="99"
                  value={playerNumberMax}
                  onChange={handleOnFilterChange}
                />{' '}
              </span>
            </div>
            <button
              className="col-sm btn btn-secondary"
              onClick={toggleTagsModal}
            >
              Choose Categories
            </button>
            {isTagsModalOpen && (
              <EventTagsModal
                toggleTagsModal={toggleTagsModal}
                setGameTags={setGameTags}
                gameTags={gameTags}
              />
            )}
            <div className="col-sm">
              Show only events created by your friends
              <label className="switch mx-2">
                <input
                  id={[FilterConstants.EVENT_FILTER_CREATED_BY_FRIENDS]}
                  type="checkbox"
                  onChange={handleOnFilterChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col-sm">
              <button
                className="btn btn-secondary"
                onClick={() => onApplyFilters()}
              >
                Apply filters
              </button>
            </div>
            <div className="col-sm">
              <button
                className="btn btn-primary"
                onClick={() => onCreateEvent()}
              >
                Create an event
              </button>
            </div>
          </div>
          {eventData.length === 0 ? (
            <h2>NO EVENTS FOUND</h2>
          ) : (
            <div className="row border bg-dark">
              <div className="col-4 border bg-dark px-0 meeting-list">
                {eventData &&
                  eventData.map((event) => (
                    <div
                      key={event.id}
                      className="row border mx-0"
                      onClick={() => changeDisplayedEvent(event.id)}
                    >
                      <div className="col-6 px-0 event-box">
                        <img
                          className="event-list-img"
                          src={
                            event.board_games.length > 0
                              ? event.board_games[0].image_url
                              : null
                          }
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/favicon.ico';
                          }}
                        ></img>
                      </div>
                      <div className="col-6">
                        <div className="py-1">{event.title}</div>
                        <div className="py-1">{event.city}</div>
                        <div className="py-1">
                          {new Date(event.event_start_date).toLocaleString(
                            'en-US',
                            dateFormat,
                          )}
                        </div>
                        <div className="py-1">
                          {event.attendees.length}/{event.max_players}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {chosenEvent !== null ? (
                <EventItem
                  chosenEvent={chosenEvent}
                  joinButton={generateJoinButton()}
                  user={user}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EventsPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object,
}.isRequired;

export default EventsPage;
