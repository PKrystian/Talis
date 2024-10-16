import PropTypes from 'prop-types';

const UserPage = ({ user }) => {
  return (
    <div>
      <div className="container text-center">
        <h1>{user.username}</h1>
      </div>
    </div>
  );
};

UserPage.propTypes = {
  user: PropTypes.object.isRequired,
}.isRequired;

export default UserPage;
