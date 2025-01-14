import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PropTypes from 'prop-types';
import '../events/EventsPage.css';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaComponent from '../../../meta/MetaComponent';
import DeleteEventModal from '../../delete/DeleteEventModal';
import { toast } from 'react-toastify';
import EventItem from '../../item/EventItem';
import EventModal from '../event_modal/EventModal';
import './UserEventsPage.css';
import { CalendarDots, MapPin, Trash, Users } from '@phosphor-icons/react';

const UserEventsPage = ({ apiPrefix, user }) => {
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenEvent, setChosenEvent] = useState(null);
  const [IsSmallScreen, setIsSmallScreen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();

  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);

  const eventsUrl = apiPrefix + 'event/user-events/';

  const dateFormat = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  };

  const fetchEventData = useCallback(async () => {
    if (!user || !user.user_id) {
      navigate('/');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        eventsUrl,
        {
          user_id: user.user_id,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      setEventData(response.data);
    } catch (error) {
      toast.error(error, {
        theme: 'dark',
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, eventsUrl]);

  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.matchMedia('(max-width: 991px)').matches;
      setIsSmallScreen(smallScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const generateJoinButton = () => {
    if (user.user_id === chosenEvent.host.id) {
      return (
        <button
          className="btn btn-danger event-delete-button my-2"
          onClick={toggleDeleteEventModal}
        >
          Delete Event
          <Trash size={20} className="ms-2"></Trash>
        </button>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { clientHeight, scrollHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, []);

  const handleDeleteEvent = () => {
    if (user.user_id !== chosenEvent.host.id) {
      return;
    }
    axios
      .post(
        `${apiPrefix}event/remove-event/`,
        {
          event_id: chosenEvent.id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        toast.success('Event deleted', {
          theme: 'dark',
        });
        setIsDeleteEventModalOpen(false);
        setChosenEvent(null);
        fetchEventData();
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const changeDisplayedEvent = (id) => {
    setChosenEvent(eventData.find((event) => event.id === id));
    if (IsSmallScreen) {
      toggleEventModal();
    }
  };

  const toggleEventModal = () => {
    setIsEventModalOpen((prev) => !prev);
  };

  const toggleDeleteEventModal = () => {
    setIsDeleteEventModalOpen((prev) => !prev);
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
      <MetaComponent
        title="Your Scheduled Meetings"
        description="View and manage events that you are a part of or that you created"
      />
      <div className="container text-center navbar-expand-lg">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 rounded-3 px-0 meeting-list">
              {eventData &&
                eventData.map((event) => (
                  <div
                    key={event.id}
                    className="row rounded-2 mb-3 mx-0 meeting-list-item"
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
                      <div className="py-1 text-start fw-bold">
                        {event.title}
                      </div>
                      <div className="pb-1 text-start">
                        <MapPin size={18} className="me-1" />
                        {event.street} {event.city}
                      </div>
                      <div className="pb-1 text-start">
                        <CalendarDots size={18} className="me-1" />
                        {new Date(event.event_start_date).toLocaleString(
                          'en-US',
                          dateFormat,
                        )}
                      </div>
                      <div className="pb-1 text-start">
                        <Users size={18} className="me-1" />
                        {event.attendees.length}/{event.max_players}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {chosenEvent !== null && !IsSmallScreen ? (
              <EventItem
                chosenEvent={chosenEvent}
                joinButton={generateJoinButton()}
                user={user}
              />
            ) : null}
            {isDeleteEventModalOpen && (
              <DeleteEventModal
                toggleDeleteEventModal={toggleDeleteEventModal}
                handleDeleteEvent={handleDeleteEvent}
                event_id={chosenEvent.event_id}
              />
            )}
            {isEventModalOpen && IsSmallScreen && (
              <EventModal
                toggleEventModal={toggleEventModal}
                chosenEvent={chosenEvent}
                joinButton={generateJoinButton()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

UserEventsPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object,
}.isRequired;

export default UserEventsPage;
