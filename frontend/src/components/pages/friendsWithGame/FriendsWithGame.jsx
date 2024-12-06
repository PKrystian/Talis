import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './FriendsWithGame.css';

const FriendsModal = ({ toggleFriendsModal, friendsWithGame }) => {
  return (
    <div className="modal-backdrop">
      <div className="friends-modal-content bg-dark text-start overflow-y-auto">
        <h2>Friends with game in {friendsWithGame[0].status}:</h2>
        {friendsWithGame.map((friend) => (
          <div key={friend.id}>
            <Link to={`/user/${friend.id}`} key={friend.id}>
              <img
                src={friend.profile_image_url}
                alt={`${friend.first_name} ${friend.last_name}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static/default-profile.png';
                }}
                title={`${friend.first_name} ${friend.last_name}`}
                className="friend-profile-img me-2"
              />
              {friend.first_name} {friend.last_name}
            </Link>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={toggleFriendsModal}>
          Close
        </button>
      </div>
    </div>
  );
};

FriendsModal.propTypes = {
  toggleFriendsModal: PropTypes.func.isRequired,
  friendsWithGame: PropTypes.array.isRequired,
};

export default FriendsModal;
