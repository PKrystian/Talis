import React from 'react';
import { Link } from 'react-router-dom';
import './FriendRequestTile.css';
import PropTypes from 'prop-types';

const FriendRequestTile = ({ invite, handleInviteAction, user }) => {
  const onClickUserImage = () => {
    document.getElementById('closeNotifications').click();
  };

  return (
    <div className="col align-items-center">
      <h4>You have a new friend request</h4>
      <div className="mt-3 d-flex justify-content-center">
        <div className="d-flex flex-row align-items-center fs-4 mx-4">
          {invite.friend.first_name} {invite.friend.first_name}
        </div>
        <Link to={`/user/${user.user_id}`}>
          <img
            className="friend-image"
            src={invite.friend.profile_image_url}
            alt={`${invite.friend.first_name}'s avatar`}
            onClick={onClickUserImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static/default-profile.png';
            }}
          />
        </Link>
      </div>
      <div className="mt-3">
        <button
          className="btn notification-primary-button w-50 mx-2"
          onClick={() => handleInviteAction('dismissed')}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

FriendRequestTile.propTypes = {
  invite: PropTypes.object.isRequired,
  handleInviteAction: PropTypes.func.isRequired,
}.isRequired;

export default FriendRequestTile;
