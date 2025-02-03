import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './UserProfilePage.css';
import CollectionPage from '../../pages/collection/CollectionPage';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';
import { PaperPlaneTilt } from '@phosphor-icons/react';

const UserProfilePage = ({ apiPrefix, user }) => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

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
    if (user && user.user_id) {
      axios
        .get(`${apiPrefix}friends/`, {
          params: {
            user_id: user.user_id,
            limit: 100,
            tags: 'accepted',
          },
        })
        .then((response) => {
          setFriends(response.data);
        })
        .catch((error) => {
          toast.error(error, {
            theme: 'dark',
            position: 'top-center',
          });
        });
      if (user.user_id === parseInt(id)) {
        axios
          .get(`${apiPrefix}friend-invites/`, {
            params: { user_id: user.user_id },
          })
          .then((response) => {
            setPendingInvites(response.data);
          })
          .catch((error) => {
            toast.error(error, {
              theme: 'dark',
              position: 'top-center',
            });
          });
      }
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

  const handleInvite = () => {
    if (!friendId) {
      setInviteMessage('Please enter a valid friend ID');
      toast.info('Please enter a valid friend ID', {
        theme: 'dark',
        position: 'top-center',
      });
      return;
    }

    axios
      .post(
        `${apiPrefix}add-friend/`,
        {
          user_id: user.user_id,
          friend_id: friendId,
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
        setFriendId('');
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
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

  const handleAccept = (friendId) => {
    axios
      .post(
        `${apiPrefix}accept-friend/`,
        {
          user_id: user.user_id,
          friend_id: friendId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        toast.success('Friend request accepted', {
          theme: 'dark',
          position: 'top-center',
        });
        const acceptedFriend = pendingInvites.find(
          (invite) => invite.id === friendId,
        );
        if (acceptedFriend) {
          setFriends([...friends, acceptedFriend]);
          setPendingInvites(
            pendingInvites.filter((invite) => invite.id !== friendId),
          );
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const handleReject = (friendId) => {
    axios
      .post(
        `${apiPrefix}reject_friend/`,
        {
          user_id: user.user_id,
          friend_id: friendId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        toast.success('Friend request rejected', {
          theme: 'dark',
          position: 'top-center',
        });
        setPendingInvites(
          pendingInvites.filter((invite) => invite.id !== friendId),
        );
      })
      .catch((error) => {
        toast.error(error.response.data.error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  if (!userProfile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile-page container">
      {user && (
        <MetaComponent
          title="Your Profile"
          description="Check information about your profile"
        />
      )}
      <div className="row d-flex">
        <div className="profile-header col-auto">
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
        </div>

        <div className="profile-info col flex-grow">
          <p>
            <strong>Name:</strong> {userProfile.first_name}{' '}
            {userProfile.last_name}
          </p>
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
        </div>

        {user.user_id && user.user_id === parseInt(id) && (
          <>
            <div className="invite-section my-3">
              <h2>Invite a Friend</h2>
              <div className="d-flex">
                <input
                  className="user-profile-form-control w-25 me-2"
                  type="text"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                  placeholder="Enter friend ID"
                />
                <button
                  className="btn user-profile-button"
                  onClick={handleInvite}
                >
                  Send Invite
                  <PaperPlaneTilt size={23} className="ms-2"></PaperPlaneTilt>
                </button>
              </div>
              {inviteMessage && (
                <div className="fs-6 ms-1 text-success">{inviteMessage}</div>
              )}
            </div>
            {pendingInvites.length > 0 && (
              <>
                <h2>Pending Friend Requests</h2>
                <div className="user-profile-pending-invites">
                  {pendingInvites.map((invite) => (
                    <div className="user-profile-invite-tile" key={invite.id}>
                      <Link to={`/user/${invite.id}`}>
                        <img
                          src={invite.profile_image_url}
                          alt={`${invite.first_name}'s avatar`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/static/default-profile.png';
                          }}
                        />
                        <p>
                          {invite.first_name} {invite.last_name}
                        </p>
                      </Link>
                      <button
                        className="btn user-profile-button"
                        onClick={() => handleAccept(invite.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn user-profile-button"
                        onClick={() => handleReject(invite.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <h1>Your Friends</h1>
            <div className="friend-tiles justify-content-center">
              {friends.map((friend) => (
                <div className="friend-tile pop" key={friend.id}>
                  <Link to={`/user/${friend.id}`}>
                    <img
                      src={friend.profile_image_url}
                      alt={`${friend.first_name}'s avatar`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/default-profile.png';
                      }}
                    />
                    <div className="my-2">
                      {friend.first_name} {friend.last_name}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {user.user_id && user.user_id !== parseInt(id) && (
          <div>
            {friendStatus !== 'accepted' && friendStatus !== 'pending' && (
              <button
                className="user-profile-button"
                onClick={handleSendRequest}
              >
                Send Friend Request
              </button>
            )}

            {friendStatus === 'pending' && (
              <button
                className="user-profile-button"
                onClick={handleCancelRequest}
              >
                Cancel Friend Request
              </button>
            )}

            {friendStatus === 'accepted' && (
              <>
                <button
                  className="btn user-profile-button"
                  onClick={handleRemoveFriend}
                >
                  Remove Friend
                </button>
              </>
            )}
          </div>
        )}

        <div className="friend-collection">
          <CollectionPage
            user={{ user_id: parseInt(id) }}
            isFriendsProfile={true}
          />
        </div>

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
