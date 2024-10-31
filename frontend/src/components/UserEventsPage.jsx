import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PropTypes from 'prop-types';
import './EventsPage.css';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OSMMap from './utils/OSMMap';

const UserEventsPage = ({ apiPrefix, user }) => {
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenEvent, setChosenEvent] = useState(null);
  const [, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();

  const eventsUrl = apiPrefix + 'event/user-events/';

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
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, eventsUrl]);

  useEffect(() => {
    fetchEventData();
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
          <div className="row border bg-dark">
            <div className="col-4 border bg-dark px-0 meeting-list">
              {eventData &&
                eventData.map((event) => (
                  <div
                    key={event.id}
                    className={`row border mx-0 ${user.user_id === event.host.id ? 'bg-success' : 'bg-warning bg-opacity-75'}`}
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
                      ></img>
                    </div>
                    <div className="col-6">
                      <p>{event.title}</p>
                      <p>{event.city}</p>
                      <p>
                        {event.attendees.length}/{event.max_players}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {chosenEvent !== null ? (
              <div className="col-8 bg-dark text-left event-details-box">
                <h1 className="text-start">{chosenEvent.title}</h1>
                <div className="description">
                  <p>{chosenEvent.description}</p>
                </div>
                <p className="text-start ">Event Tags Event Tags Event Tags</p>
                <div className="row">
                  <div className="col-7">
                    <p className="text-start display-5">
                      {chosenEvent.attendees.length}/{chosenEvent.max_players}{' '}
                      Crew
                    </p>
                    <div className="row">
                      <div className="circle me-2"></div>
                      <div className="circle me-2"></div>
                      <div className="circle me-2"></div>
                    </div>
                    {chosenEvent.coordinates && (
                      <div className="bg-black mt-2 event-map">
                        <OSMMap coordinates={chosenEvent.coordinates} />
                      </div>
                    )}
                  </div>
                  <div className="col-5">
                    {chosenEvent.board_games.map((boardGame, index) => {
                      if (index % 2 === 0) {
                        return (
                          <div className="row align-items-center" key={index}>
                            <div className="col">
                              <img
                                className="img-fluid"
                                src={boardGame.image_url}
                                alt=""
                              />
                            </div>
                            {chosenEvent.board_games[index + 1] && (
                              <div className="col">
                                <img
                                  className="img-fluid"
                                  src={
                                    chosenEvent.board_games[index + 1].image_url
                                  }
                                  alt=""
                                />
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ) : null}
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
