import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './UserProfilePage.css';
import CollectionPage from '../../pages/collection/CollectionPage';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';

const UserProfilePage = ({ apiPrefix, user }) => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiPrefix}user/${id}/`)
      .then((response) => setUserProfile(response.data))
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });

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
        .catch((error) => {
          toast.error(error, {
            theme: 'dark',
            position: 'top-center',
          });
        });
    }
  }, [apiPrefix, id, user]);

  const handleSendRequest = () => {
    axios
      .post(
        `${apiPrefix}add-friend/`,
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
      .then(() => {
        toast.success('Friend request sent', {
          theme: 'dark',
        });
        setFriendStatus('pending');
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
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
      .then(() => {
        toast.info('Friend request rejected', {
          theme: 'dark',
          position: 'top-center',
        });
        setFriendStatus(null);
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
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
      .then(() => {
        toast.info('Friend removed', {
          theme: 'dark',
        });
        setFriendStatus(null);
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  if (!userProfile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile-page">
      {user && (
        <MetaComponent
          title="Your Profile"
          description="Check information about your profile"
        />
      )}
      <div className="profile-header">
        <img
          src={
            userProfile.profile_image_url
              ? userProfile.profile_image_url
              : '/static/default-profile.png'
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/static/default-profile.png';
          }}
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

        {user.user_id && user.user_id !== parseInt(id) && (
          <>
            {friendStatus !== 'accepted' && friendStatus !== 'pending' && (
              <button onClick={handleSendRequest}>Send Friend Request</button>
            )}

            {friendStatus === 'pending' && (
              <button onClick={handleCancelRequest}>
                Cancel Friend Request
              </button>
            )}

            {friendStatus === 'accepted' && (
              <>
                <button onClick={handleRemoveFriend}>Remove Friend</button>
                <div className="friend-collection">
                  <CollectionPage user={{ user_id: parseInt(id) }} />
                </div>
              </>
            )}
          </>
        )}

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
