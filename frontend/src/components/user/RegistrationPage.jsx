import { useNavigate } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './RegistrationPage.css';
import LoginButton from '../utils/LoginButton';
import FormConstants from '../../FormConstants';

const RegistrationPage = ({
  apiPrefix,
  userState,
  setUserData,
  setUserState,
}) => {
  const navigate = useNavigate();

  if (userState) {
    navigate('/');
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');

  const [emailErrorStyle, setEmailErrorStyle] = useState('');
  const [passwordErrorStyle, setPasswordErrorStyle] = useState('');
  const [repeatPasswordErrorStyle, setRepeatPasswordErrorStyle] = useState('');

  const [submitClickedOnce, setSubmitClickedOnce] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const [submitButtonStyle, setSubmitButtonStyle] = useState(
    'btn-outline-secondary',
  );

  const setterMap = {
    [FormConstants.REGISTRATION_FIRST_NAME_FIELD]: setFirstName,
    [FormConstants.REGISTRATION_LAST_NAME_FIELD]: setLastName,
    [FormConstants.REGISTRATION_BIRTH_DATE_FIELD]: setBirthDate,
    [FormConstants.REGISTRATION_EMAIL_FIELD]: setEmail,
    [FormConstants.REGISTRATION_PASSWORD_FIELD]: setPassword,
    [FormConstants.REGISTRATION_REPEAT_PASSWORD_FIELD]: setRepeatPassword,
    [FormConstants.REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX]:
      setTermsAndConditions,
  };

  const validators = [validateForm, validateEmail, validatePassword];

  function validateForm() {
    if (password && repeatPassword && password !== repeatPassword) {
      setRepeatPasswordError('Repeat Password has to match password');
      setRepeatPasswordErrorStyle(' wrong-input');
      setIsFormValid(false);
      setSubmitButtonStyle('btn-outline-secondary');
      return false;
    }

    setRepeatPasswordError('');
    setRepeatPasswordErrorStyle('');

    if (
      firstName &&
      birthDate &&
      email &&
      password &&
      repeatPassword &&
      termsAndConditions
    ) {
      setIsFormValid(true);
      setSubmitButtonStyle('btn-secondary');
      return true;
    }

    setIsFormValid(false);
    setSubmitButtonStyle('btn-outline-secondary');
    return false;
  }

  function handleFormOnChange(e) {
    let key = e.target.id;
    let value = e.target.value;

    if (
      e.target.id === FormConstants.REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX
    ) {
      value = e.target.checked;
    }

    setterMap[key](value);
  }

  function validateEmail() {
    if (!FormConstants.EMAIL_PATTERN.test(email)) {
      setEmailError('Email has wrong format');
      setEmailErrorStyle(' wrong-input');
      return false;
    }

    setEmailError('');
    setEmailErrorStyle('');
    return true;
  }

  function validatePassword() {
    if (!FormConstants.PASSWORD_PATTERN.test(password)) {
      setPasswordError('Password has wrong format');
      setPasswordErrorStyle(' wrong-input');
      return false;
    }

    setPasswordError('');
    setPasswordErrorStyle('');
    return true;
  }

  function handleSubmit() {
    setSubmitClickedOnce(true);
    let validations = [];

    validators.forEach((validator) => {
      validations.push(validator());
    });

    if (validations.every((v) => v === true)) {
      let newUser = {
        [FormConstants.REGISTRATION_FIRST_NAME_FIELD]: firstName,
        [FormConstants.REGISTRATION_LAST_NAME_FIELD]: lastName,
        [FormConstants.REGISTRATION_BIRTH_DATE_FIELD]: birthDate,
        [FormConstants.REGISTRATION_EMAIL_FIELD]: email,
        [FormConstants.REGISTRATION_PASSWORD_FIELD]: password,
      };

      let url = apiPrefix + 'register/';

      axios
        .post(url, newUser, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((resp) => {
          if (resp.status === 200 && resp.data.is_authenticated) {
            setUserState(resp.data.is_authenticated);
            setUserData({
              username: resp.data.username,
              user_id: resp.data.user_id,
              is_superuser: resp.data.is_superuser,
              profile_image_url: resp.data.profile_image_url,
              cookie_consent: resp.data.cookie_consent,
            });
            navigate('/');
          } else {
            console.error('User registration failed ');
          }
        })
        .catch((error) => {
          console.error('Error during registration:', error);
        });
    }
  }

  useEffect(() => {
    if (submitClickedOnce) {
      validators.forEach((validator) => {
        validator();
      });
    }
    validateForm();
  });

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="backplate fade-in-1s">
        <div className="mt-4 mb-4 mx-5">
          <h2>Sign up</h2>
          <hr></hr>
          <form
            id="register-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="form-group row mt-2">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.REGISTRATION_FIRST_NAME_FIELD}
                  className="form-label"
                >
                  First Name
                </label>
                <input
                  id={FormConstants.REGISTRATION_FIRST_NAME_FIELD}
                  className="form-control"
                  type="text"
                  value={firstName}
                  onChange={handleFormOnChange}
                  placeholder="name"
                  required
                />
              </div>

              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.REGISTRATION_LAST_NAME_FIELD}
                  className="form-label"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="optional field"
                >
                  Last Name *
                </label>
                <input
                  id={FormConstants.REGISTRATION_LAST_NAME_FIELD}
                  className="form-control"
                  type="text"
                  value={lastName}
                  onChange={handleFormOnChange}
                  placeholder="surname"
                />
              </div>
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_BIRTH_DATE_FIELD}
                className="form-label"
              >
                Date of birth
              </label>
              <input
                id={FormConstants.REGISTRATION_BIRTH_DATE_FIELD}
                className="form-control"
                type="date"
                onChange={handleFormOnChange}
                required
              />
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_EMAIL_FIELD}
                className="form-label"
              >
                Email
              </label>
              <input
                id={FormConstants.REGISTRATION_EMAIL_FIELD}
                className={`form-control${emailErrorStyle}`}
                type="email"
                value={email}
                onChange={handleFormOnChange}
                placeholder="example@mail.com"
                required
              />
              {emailError && <p className="mb-0">{emailError}</p>}
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_PASSWORD_FIELD}
                className="form-label"
              >
                Password
              </label>
              <input
                id={FormConstants.REGISTRATION_PASSWORD_FIELD}
                className={`form-control${passwordErrorStyle}`}
                type="password"
                value={password}
                onChange={handleFormOnChange}
                placeholder="your password"
                required
              />
              {passwordError && <p className="mb-0">{passwordError}</p>}
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_REPEAT_PASSWORD_FIELD}
                className="form-label"
              >
                Repeat Password
              </label>
              <input
                id={FormConstants.REGISTRATION_REPEAT_PASSWORD_FIELD}
                className={`form-control${repeatPasswordErrorStyle}`}
                value={repeatPassword}
                onChange={handleFormOnChange}
                type="password"
                required
              />
              {repeatPasswordError && (
                <p className="mb-0">{repeatPasswordError}</p>
              )}
            </div>

            <div className="form-group form-check mt-3 d-flex justify-content-between">
              <div>
                <input
                  id={FormConstants.REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX}
                  className="form-check-input"
                  onChange={handleFormOnChange}
                  type="checkbox"
                  required
                />
                <label
                  className="form-check-label"
                  htmlFor={
                    FormConstants.REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX
                  }
                >
                  I Accept the terms and conditions
                </label>
              </div>
              <div className="info-icon-container">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="info-icon"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Our terms and conditions - Do not steal our games please"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn ${submitButtonStyle} form-control mt-2`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Sign up
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="login-tooltip">
              Already have an account?
              <LoginButton
                ButtonTag={'a'}
                buttonClass={'mx-2 text-decoration-none'}
                buttonText={'Login'}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

RegistrationPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  userState: PropTypes.bool.isRequired,
  setUserData: PropTypes.func.isRequired,
  setUserState: PropTypes.func.isRequired,
}.isRequired;

export default RegistrationPage;
