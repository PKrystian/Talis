import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyAccount = ({ apiPrefix, user }) => {
  const navigate = useNavigate();

  if (!user || (user && user.is_active)) {
    navigate('/');
  }

  const { token } = useParams();

  useEffect(() => {
    axios.get(`${apiPrefix}verify/${token}/`).catch((error) => {
      console.error('Error getting access:', error);
    });
    navigate('/');
  }, []);
};

VerifyAccount.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default VerifyAccount;
