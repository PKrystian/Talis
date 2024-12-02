import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './VerifyAccount.css';

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
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
    navigate('/');
  }, [apiPrefix, navigate, token]);
};

VerifyAccount.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default VerifyAccount;
