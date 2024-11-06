import PropTypes from 'prop-types';
import OSMMap from '../utils/OSMMap';

const EventItem = ({ chosenEvent, joinButton = null }) => {
  return (
    <div className="col-8 bg-dark text-left event-details-box p-3">
      <h1 className="text-start">{chosenEvent.title}</h1>
      <div className="description">
        <p>{chosenEvent.description}</p>
      </div>
      <p className="text-start d-flex">
        {chosenEvent.tags.map((tag) => {
          return (
            <div key={tag} className="mx-1">
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
