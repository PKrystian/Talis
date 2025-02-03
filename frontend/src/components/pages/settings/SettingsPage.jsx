import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import FormConstants from '../../../constValues/FormConstants';
import './SettingsPage.css';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';

const SettingsPage = ({ apiPrefix, user }) => {
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [, setUserData] = useState({});

  const [, setEmailError] = useState('');
  const [, setEmailErrorStyle] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();

  const fetchUserData = useCallback(() => {
    if (!user || !user.user_id) {
      navigate('/');
      return;
    }
    if (user && user.user_id) {
      axios
        .get(`${apiPrefix}user/${user.user_id}/`)
        .then((response) => {
          setUserData(response.data);
          setEmail(response.data.email);
          setAvatar(response.data.profile_image_url);
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setBirthdate(response.data.birth_date);
        })
        .catch((error) => {
          toast.error(error, {
            theme: 'dark',
            position: 'top-center',
          });
        });
    }
  }, [apiPrefix, user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const validateEmail = useCallback(() => {
    if (!FormConstants.EMAIL_PATTERN.test(email)) {
      setEmailError('Email has wrong format');
      setEmailErrorStyle('is-invalid');
      setIsFormValid(false);
      return false;
    }
    setEmailError('');
    setEmailErrorStyle('');
    setIsFormValid(true);
    return true;
  }, [email]);

  useEffect(() => {
    validateEmail();
  }, [email, validateEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const updatedUser = {
      email: email,
      profile_image_url: avatar,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthdate,
    };

    axios
      .post(
        `${apiPrefix}update-user/`,
        {
          user_id: user.user_id,
          updated_user: updatedUser,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        fetchUserData();
        navigate(`/user/${user.user_id}`);
      })
      .catch((error) => {
        toast.error(error, {
          theme: 'dark',
          position: 'top-center',
        });
      });
  };

  return (
    <div className="settings-page container">
      <MetaComponent
        title="User Settings"
        description="Manage your account details"
      />
      <h2 className="mb-4">Settings</h2>
      <div className="row">
        <form onSubmit={handleSubmit} className="col-md-6 me-6">
          <div className="mb-3 m-auto settings-page-input-container">
            <label htmlFor="avatar" className="settings-page-form-label">
              Avatar
            </label>
            <div className="align-items-center">
              {avatar && (
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/static/default-profile.png';
                  }}
                  className="avatar-preview mb-3"
                />
              )}
              <div className="text-center">
                <input
                  type="text"
                  id="avatar"
                  className="settings-page-form-control"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="mb-3 m-auto settings-page-input-container">
            <label htmlFor="firstName" className="settings-page-form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="settings-page-form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 m-auto settings-page-input-container">
            <label htmlFor="lastName" className="settings-page-form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="settings-page-form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-3 m-auto settings-page-input-container">
            <label htmlFor="birthdate" className="settings-page-form-label">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              className="settings-page-form-control"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
          </div>
          <div className="m-auto settings-page-input-container">
            <button
              type="submit"
              className="btn settings-page-save-button w-100"
              disabled={!isFormValid}
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="registration-image col-md-6 d-none d-md-block align-content-center justify-content-center ps-3">
          <img
            className="img-fluid"
            alt="noimg"
            src="/static/assets/undraw_personal-information_gbtc.svg"
          ></img>
        </div>
      </div>
    </div>
  );
};

SettingsPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
    email: PropTypes.string,
    profile_image_url: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    birth_date: PropTypes.string,
  }).isRequired,
};

export default SettingsPage;
