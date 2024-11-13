import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import FormConstants from '../constValues/FormConstants';
import './SettingsPage.css';
import MetaComponent from './meta/MetaComponent';

const SettingsPage = ({ apiPrefix, user }) => {
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [userData, setUserData] = useState({});

  const [emailError, setEmailError] = useState('');
  const [emailErrorStyle, setEmailErrorStyle] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const navigate = useNavigate();

  const fetchUserData = () => {
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
        .catch((error) => console.error('Error fetching user data:', error));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const validateEmail = () => {
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
  };

  useEffect(() => {
    validateEmail();
  }, [email]);

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
        `${apiPrefix}update_user/`,
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
        console.error('Error updating user:', error);
      });
  };

  return (
    <div className="settings-page container">
      <MetaComponent title="User Settings" description="User settings page" />
      <h2 className="text-center mb-4">Settings</h2>
      <form onSubmit={handleSubmit}>
        {/*commenting out email field as we might use it in the future*/}
        {/*<div className="mb-3">*/}
        {/*  <label htmlFor="email" className="form-label">*/}
        {/*    Email*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*    type="email"*/}
        {/*    id="email"*/}
        {/*    className={`form-control ${emailErrorStyle}`}*/}
        {/*    value={email}*/}
        {/*    onChange={(e) => setEmail(e.target.value)}*/}
        {/*    onBlur={validateEmail}*/}
        {/*    required*/}
        {/*  />*/}
        {/*  {emailError && <div className="invalid-feedback">{emailError}</div>}*/}
        {/*</div>*/}

        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">
            Avatar
          </label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              id="avatar"
              className="form-control"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {avatar && (
              <img
                src={avatar}
                alt="Avatar Preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static/default-profile.png';
                }}
                className="avatar-preview ms-3"
              />
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="birthdate" className="form-label">
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            className="form-control"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!isFormValid}
        >
          Save Changes
        </button>
      </form>
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
