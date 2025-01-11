import React from 'react';
import PropTypes from 'prop-types';
import OSMMap from '../../utils/map/OSMMap';
import './EventItem.css';
import { Link } from 'react-router-dom';
import {
  CalendarDots,
  MapPin,
  UserCircleGear,
  Users,
} from '@phosphor-icons/react';

const dateFormat = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

const EventItem = ({ chosenEvent, joinButton = null, user }) => {
  return (
    <div className="col ms-3 rounded-4 text-left event-details-box p-3">
      <div className="row">
        <h1 className="text-start col-6">{chosenEvent.title}</h1>
        <div className="col-6 mt-3 text-end">
          <CalendarDots size={25}></CalendarDots>
          {new Date(chosenEvent.event_start_date).toLocaleString(
            'en-US',
            dateFormat,
          )}
        </div>
      </div>
      <div className="description text-start">
        <p>{chosenEvent.description}</p>
      </div>
      <div className="text-start d-flex flex-wrap">
        {chosenEvent.tags.map((tag) => {
          return (
            <div key={tag} className="px-2 py-1 rounded-3 m-1 event-tags">
              {tag}
            </div>
          );
        })}
      </div>
      <div className="row">
        <div className="col-5">
          <div className="text-start">
            <div className="fs-4 mb-3">
              <UserCircleGear className="me-3" size={45}></UserCircleGear>
              Hosted by:
            </div>
            <Link to={`/user/${chosenEvent.host.id}`}>
              <div className="d-inline-flex mb-2">
                <img
                  src={chosenEvent.host.profile_image_url}
                  alt={`${chosenEvent.host.first_name} ${chosenEvent.host.last_name}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/static/default-profile.png';
                  }}
                  title={`${chosenEvent.host.first_name} ${chosenEvent.host.last_name}`}
                  className="friend-profile-img"
                />
                <div className="d-flex ps-2 py-0 align-items-center">
                  {chosenEvent.host.first_name} {chosenEvent.host.last_name}
                </div>
              </div>
            </Link>
          </div>
          <div className="text-start fs-4 mb-2">
            <Users size={45} className="me-3" />
            {chosenEvent.attendees.length}/{chosenEvent.max_players} Crew
          </div>
          <div className="text-start">
            {chosenEvent.attendees.map((attendee) => (
              <div className="d-flex" key={attendee.id}>
                <Link to={`/user/${attendee.id}`}>
                  <div className="d-inline-flex">
                    <img
                      src={attendee.profile_image_url}
                      alt={`${attendee.first_name} ${attendee.last_name}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/default-profile.png';
                      }}
                      title={`${attendee.first_name} ${attendee.last_name}`}
                      className="friend-profile-img"
                    />
                    <div className="d-flex ps-2 py-0 align-items-center">
                      {attendee.first_name} {attendee.last_name}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="col-7">
          {chosenEvent.board_games.map((boardGame, index) => {
            if (index % 3 === 0) {
              return (
                <div className="row align-items-center" key={index}>
                  <div className="col">
                    <Link to={`/game/${boardGame.id}`}>
                      <img
                        className="img-fluid"
                        src={boardGame.image_url}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/static/favicon.ico';
                        }}
                      />
                    </Link>
                  </div>
                  {chosenEvent.board_games[index + 1] && (
                    <div className="col">
                      <Link
                        to={`/game/${chosenEvent.board_games[index + 1].id}`}
                      >
                        <img
                          className="img-fluid"
                          src={chosenEvent.board_games[index + 1].image_url}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/favicon.ico';
                          }}
                        />
                      </Link>
                    </div>
                  )}
                  {chosenEvent.board_games[index + 2] && (
                    <div className="col">
                      <Link
                        to={`/game/${chosenEvent.board_games[index + 2].id}`}
                      >
                        <img
                          className="img-fluid"
                          src={chosenEvent.board_games[index + 2].image_url}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/favicon.ico';
                          }}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="event-address text-start py-2">
          <MapPin size={18} className="me-1 mb-1" />
          {chosenEvent.city} {chosenEvent.street} {chosenEvent.zip_code}
        </div>
        {chosenEvent.coordinates && (
          <div className=" mt-2 event-map">
            <OSMMap coordinates={chosenEvent.coordinates} />
          </div>
        )}
        {joinButton && <div className="col-12 mt-3">{joinButton}</div>}
      </div>
    </div>
  );
};

EventItem.propTypes = {
  chosenEvent: PropTypes.object.isRequired,
  joinButton: PropTypes.object,
}.isRequired;

export default EventItem;
