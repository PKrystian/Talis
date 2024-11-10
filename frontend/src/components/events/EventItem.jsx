import PropTypes from 'prop-types';
import OSMMap from '../utils/OSMMap';
import { Link } from 'react-router-dom';

const EventItem = ({ chosenEvent, joinButton = null, user }) => {
  return (
    <div className="col-8 bg-dark text-left event-details-box p-3">
      <h1 className="text-start">{chosenEvent.title}</h1>
      <div className="description">
        <p>{chosenEvent.description}</p>
      </div>
      <p className="text-start d-flex">
        {chosenEvent.tags.map((tag) => {
          return (
            <div key={tag} className="px-2 m-1 bg-black">
              {tag}
            </div>
          );
        })}
      </p>
      <div className="row">
        <div className="col-7">
          <p className="text-start display-5">
            {chosenEvent.attendees.length}/{chosenEvent.max_players} Crew
          </p>
          <div className="d-flex">
            {chosenEvent.attendees
              .filter((attendee) => attendee.id !== user.user_id)
              .map((attendee) => (
                <Link to={`/user/${attendee.id}`} key={attendee.id}>
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
                </Link>
              ))}
          </div>
          <div className="text-start display-5">
            Hosted by:
            <Link to={`/user/${chosenEvent.host.id}`}>
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
            </Link>
          </div>
          <div className="event-address py-2">
            {chosenEvent.city} {chosenEvent.street} {chosenEvent.zip_code}
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/favicon.ico';
                      }}
                    />
                  </div>
                  {chosenEvent.board_games[index + 1] && (
                    <div className="col">
                      <img
                        className="img-fluid"
                        src={chosenEvent.board_games[index + 1].image_url}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/static/favicon.ico';
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
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
