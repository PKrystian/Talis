import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './UserProfilePage.css';

const UserProfilePage = ({ apiPrefix, user }) => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiPrefix}user/${id}/`)
      .then((response) => setUserProfile(response.data))
      .catch((error) => console.error('Error fetching user data:', error));

    if (user && user.user_id && user.user_id !== parseInt(id)) {
      axios
        .post(
          `${apiPrefix}friend_status/`,
          {
            user_id: user.user_id,
            friend_id: id,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .then((response) => setFriendStatus(response.data.status))
        .catch((error) =>
          console.error('Error fetching friend status:', error),
        );
    }
  }, [apiPrefix, id, user]);

  const handleSendRequest = () => {
    axios
      .post(
        `${apiPrefix}add_friend/`,
        {
          user_id: user.user_id,
          friend_id: id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => setFriendStatus('pending'))
      .catch((error) => console.error('Error sending friend request:', error));
  };

  const handleCancelRequest = () => {
    axios
      .post(
        `${apiPrefix}reject_friend/`,
        {
          user_id: user.user_id,
          friend_id: id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => setFriendStatus(null))
      .catch((error) =>
        console.error('Error canceling friend request:', error),
      );
  };

  const handleRemoveFriend = () => {
    axios
      .post(
        `${apiPrefix}remove_friend/`,
        {
          user_id: user.user_id,
          friend_id: id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => setFriendStatus(null))
      .catch((error) => console.error('Error removing friend:', error));
  };

  if (!userProfile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <img
          src={userProfile.profile_image_url}
          alt={`${userProfile.first_name}'s profile`}
          className="profile-image"
        />
        <h1>
          {userProfile.first_name} {userProfile.last_name}
        </h1>
      </div>

      <div className="profile-info">
        <p>
          <strong>ID:</strong> {userProfile.user_id}
        </p>
        <p>
          <strong>Joined:</strong>{' '}
          {new Date(userProfile.date_joined).toLocaleDateString()}
        </p>

        {/* Show additional details only if viewing own profile */}
        {user.user_id && user.user_id === parseInt(id) && (
          <>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Birth Date:</strong>{' '}
              {new Date(userProfile.birth_date).toLocaleDateString()}
            </p>
          </>
        )}

        {/* Show friend request/remove buttons only if user is logged in and viewing someone else's profile */}
        {user.user_id && user.user_id !== parseInt(id) && (
          <>
            {/* Show "Send Friend Request" button if the user is not friends and no pending request */}
            {friendStatus !== 'accepted' && friendStatus !== 'pending' && (
              <button onClick={handleSendRequest}>Send Friend Request</button>
            )}

            {/* Show "Cancel Friend Request" button if there's a pending request */}
            {friendStatus === 'pending' && (
              <button onClick={handleCancelRequest}>
                Cancel Friend Request
              </button>
            )}

            {/* Show "Remove Friend" button if they are already friends */}
            {friendStatus === 'accepted' && (
              <button onClick={handleRemoveFriend}>Remove Friend</button>
            )}
          </>
        )}

        {/* Show admin info if the logged-in user is a superuser */}
        {user && user.is_superuser && (
          <>
            <h1>Admin Info</h1>
            <p>
              <strong>Username:</strong> {userProfile.username}
            </p>
            <p>
              <strong>Superuser:</strong>{' '}
              {userProfile.is_superuser ? 'Yes' : 'No'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

UserProfilePage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
    is_superuser: PropTypes.bool,
  }),
};

export default UserProfilePage;
