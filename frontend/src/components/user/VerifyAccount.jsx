import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyAccount = ({ apiPrefix, user }) => {
  const navigate = useNavigate();

  if (!user || (user && user.is_active)) {
    navigate('/');
  }

  const { token } = useParams();

  useEffect(() => {
    axios
      .get(`${apiPrefix}verify/${token}/`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((error) => {
        console.error('Error getting access:', error);
      })
      .then((resp) => {
        if (resp.status === 200) {
          toast.success('User account Verified. You can now login', {
            position: 'top-center',
            theme: 'dark',
            bodyClassName: () => 'd-flex p-2 text-center',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    navigate('/');
  }, []);
};

VerifyAccount.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default VerifyAccount;
