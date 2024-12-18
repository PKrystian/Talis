import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FriendListPage.css';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';

const FriendListPage = ({ apiPrefix, user }) => {
  const [friends, setFriends] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  useEffect(() => {
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
  }, [apiPrefix, user]);

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

  if (!user || !user.user_id) {
    return (
      <div className="center-message">
        <h2>Please log in to see your friends</h2>
      </div>
    );
  }

  return (
    <div className="friend-list-page">
      <MetaComponent
        title="Your Friends"
        description="Manage and connect with new friends"
      />

      <h1>Your Friends</h1>
      <div className="friend-tiles">
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

      <div className="invite-section my-3">
        <h2>Invite a Friend</h2>
        <div className="d-flex">
          <input
            className="form-control w-25 me-2"
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="Enter friend ID"
          />
          <button className="btn btn-light" onClick={handleInvite}>
            Send Invite
          </button>
        </div>
        {inviteMessage && (
          <div className="fs-6 ms-1 text-success">{inviteMessage}</div>
        )}
      </div>

      {pendingInvites.length > 0 && (
        <>
          <h2>Pending Friend Requests</h2>
          <div className="pending-invites">
            {pendingInvites.map((invite) => (
              <div className="invite-tile" key={invite.id}>
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
                <button onClick={() => handleAccept(invite.id)}>Accept</button>
                <button onClick={() => handleReject(invite.id)}>Reject</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

FriendListPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
  }).isRequired,
};

export default FriendListPage;
