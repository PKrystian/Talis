import PropTypes from 'prop-types';

const InviteItem = ({ invite }) => {
  return (
    <div className="d-flex flex-row">
      <div className="flex-fill">
        <p>{invite.friend.profile_image_url}</p>
        <p>
          {invite.friend.first_name} {invite.friend.last_name}
        </p>
        <p>{invite.event.title}</p>
      </div>
      <div className="align-self-center">
        <button className="btn btn-primary mx-1">Accept</button>
        <button className="btn btn-secondary mx-1">Cancel</button>
      </div>
    </div>
  );
};

InviteItem.propTypes = {
  invite: PropTypes.object.isRequired,
}.isRequired;

export default InviteItem;
