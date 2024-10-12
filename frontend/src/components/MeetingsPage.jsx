import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './MeetingsPage.css';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

const MeetingsPage = ({user}) => {
  const [collectionData, setCollectionData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenEvent, setChosenEvent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/' : '/api/';
  const eventsUrl = apiPrefix + 'event/get/';

  const fetchEventData = async () => {
    if (!user || !user.user_id) {
      console.error('User ID is not available');
      return;
    }
    setIsLoading(true);
    try {
      const response1 = await axios.get(
        eventsUrl,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setEventData(response1.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEventData();
  }, [user]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { clientHeight, scrollHeight } = descriptionRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  });

  const changeDisplayedEvent = (id) => {
    console.log(eventData);
    setChosenEvent(eventData.find((event) => event.id === id));
  }

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
          <button className="navbar-toggler navbar-dark mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#meetingsFilter" aria-controls="meetingsFilter" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="row border bg-black mt-3 mb-3 collapse navbar-collapse" id="meetingsFilter">
            <div className="col-sm row-sm py-2">
              <div>Distance</div>
              <span><input className="number-input" type="number"></input>km from you</span>
            </div>
            <div className="col-sm py-2">
              <div>Date</div>
              <input className="date-input" type="date"></input>
            </div>
            <div className="col-sm py-2">
              <div>No. of players</div>
              <span><input className="number-input" type="number"></input> to <input className="number-input" type="number"></input></span>
            </div>
            <div className="col-sm">Game categories</div>
            <div className="col-sm">Show only events created by your friends
              <label className="switch">
              <input type="checkbox"/>
              <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="row border bg-dark">
            <div className="col-4 border bg-dark px-0 meeting-list">
            {eventData.map(event => (
                  <div key={event.id} className="row border mx-0" onClick={() => changeDisplayedEvent(event.id) }>
                    <div className="col-6 px-0 event-box">
                      <img className="event-list-img" src={event.board_games.length > 0 ? event.board_games[0].image_url : null}></img>
                    </div>
                    <div className="col-6">
                      <p>{event.title}</p>
                      <p>{event.city}</p>
                      <p>{event.attendees.length}/{event.max_players}</p>
                    </div>
                  </div>
              ))}
            </div>
            {chosenEvent !== null ?
            <div className="col-8 bg-dark text-left event-details-box">
              <h1 className="text-start">{chosenEvent.title}</h1>
              <div className="description">
                <p>{chosenEvent.description}</p>
              </div>
              <p className="text-start ">Event Tags Event Tags Event Tags</p>
              <div className="row">
                <div className="col-7">
                  <p className="text-start display-5">{chosenEvent.attendees.length}/{chosenEvent.max_players} Crew</p>
                  <div className="row">
                    <div className="circle me-2"></div>
                    <div className="circle me-2"></div>
                    <div className="circle me-2"></div>
                  </div>
                  <div className="bg-black mt-1 event-map">Here is space for map</div>
                </div>
                <div className="col-5">
                  {chosenEvent.board_games.map((boardGame, index) => {
                    if (index % 2 === 0) {
                      return (
                        <div className="row align-items-center" key={index}>
                          <div className="col event-boardgame-img">
                            <img className="img-fluid" src={boardGame.image_url} />
                          </div>
                          {chosenEvent.board_games[index + 1] && (
                            <div className="col event-boardgame-img">
                              <img className="img-fluid" src={chosenEvent.board_games[index + 1].image_url} />
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingsPage;
