import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyAccount = ({ apiPrefix, user, setUserState, setUserData }) => {
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
          setUserState(resp.data.is_authenticated);
          setUserData({
            username: resp.data.username,
            user_id: resp.data.user_id,
            is_superuser: resp.data.is_superuser,
            profile_image_url: resp.data.profile_image_url,
            cookie_consent: resp.data.cookie_consent,
            is_active: resp.data.is_active,
          });

          toast.success('User account Verified', {
            position: 'top-center',
            theme: 'dark',
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
