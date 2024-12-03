import axios from 'axios';
import PropTypes from 'prop-types';
import EventRequestTile from '../request/event/EventRequestTile';
import FriendRequestTile from '../request/friend/FriendRequestTile';
import InviteConstants from '../../../constValues/InviteConstants';
import React from 'react';
import './InviteItem.css';
import { toast } from 'react-toastify';

const InviteItem = ({ apiPrefix, user, invite, fetchInvites }) => {
  const handleInviteAction = (choice) => {
    axios
      .post(
        apiPrefix + 'invite/invite-accept-reject/',
        {
          user_id: user.user_id,
          invite_id: invite.id,
          choice: choice,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then(() => {
        fetchInvites();
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  const resolveInviteType = () => {
    switch (invite.type) {
      case InviteConstants.INVITE_TYPE_NEW_FRIEND_REQUEST:
        return (
          <FriendRequestTile
            invite={invite}
            handleInviteAction={handleInviteAction}
          />
        );
      case InviteConstants.INVITE_TYPE_EVENT_JOIN_REQUEST:
        return (
          <EventRequestTile
            invite={invite}
            handleInviteAction={handleInviteAction}
          />
        );
      case InviteConstants.INVITE_TYPE_EVENT:
        return (
          <EventRequestTile
            invite={invite}
            handleInviteAction={handleInviteAction}
          />
        );
      default:
        return '';
    }
  };

  return <div className="d-flex flex-row">{resolveInviteType()}</div>;
};

InviteItem.propTypes = {
  invite: PropTypes.object.isRequired,
}.isRequired;

export default InviteItem;
