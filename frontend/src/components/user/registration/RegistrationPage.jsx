import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './RegistrationPage.css';
import LoginButton from '../../utils/login/button/LoginButton';
import FormConstants from '../../../constValues/FormConstants';
import FormPasswordInput from '../../utils/password/FormPasswordInput';
import MetaComponent from '../../meta/MetaComponent';
import { toast } from 'react-toastify';

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

  const [isLoading, setIsLoading] = useState(false);

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

  const updateAlert = (toastId, setting) => {
    setIsLoading(false);

    switch (setting) {
      case 'success':
        toast.update(toastId, {
          render: 'Registered Successfully',
          type: 'success',
          position: 'top-center',
          theme: 'dark',
          isLoading: false,
          autoClose: 1500,
        });
        break;
      case 'warning':
        toast.update(toastId, {
          render: 'User with this email already exists',
          type: 'warning',
          position: 'top-center',
          theme: 'dark',
          bodyClassName: () => 'd-flex p-2 text-center',
          isLoading: false,
          autoClose: 3000,
        });
        break;
      default:
        toast.update(toastId, {
          render: 'Something went wrong',
          type: 'error',
          position: 'top-center',
          theme: 'dark',
          bodyClassName: () => 'd-flex p-2 text-center',
          isLoading: false,
          autoClose: 3000,
        });
        break;
    }
  };

  function handleSubmit() {
    setSubmitClickedOnce(true);
    let validations = [];

    validators.forEach((validator) => {
      validations.push(validator());
    });

    if (validations.every((v) => v === true)) {
      setIsLoading(true);
      const toastId = toast.loading('Loading', {
        position: 'top-center',
        theme: 'dark',
      });

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
            updateAlert(toastId, 'success');
            setUserState(resp.data.is_authenticated);
            setUserData({
              username: resp.data.username,
              user_id: resp.data.user_id,
              is_superuser: resp.data.is_superuser,
              profile_image_url: resp.data.profile_image_url,
              cookie_consent: resp.data.cookie_consent,
              is_active: resp.data.is_active,
            });
            navigate('/');
          } else {
            updateAlert(toastId, 'warning');
          }
        })
        .catch((error) => {
          updateAlert(toastId, 'warning');
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
    <div className="register-container px-0 px-md-5 d-flex pt-4">
      <MetaComponent
        title="Register"
        description="Register on Talis now to gain access to your own library of games, wishlisting as well as joining and creating social events"
      />
      <div className="col-md-6 col-12 ps-md-5 fade-in-1s d-flex justify-content-center justify-content-md-end me-5">
        <div className="register-form-container mt-4">
          <h2>Sign up</h2>
          <form
            id="register-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="row mt-4">
              <div className="col fade-in-2s">
                <label
                  htmlFor={FormConstants.REGISTRATION_FIRST_NAME_FIELD}
                  className="registration-form-label"
                >
                  First Name
                </label>
                <input
                  id={FormConstants.REGISTRATION_FIRST_NAME_FIELD}
                  className="registration-form-control"
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
                  className="registration-form-label"
                >
                  Last Name ( optional )
                </label>
                <input
                  id={FormConstants.REGISTRATION_LAST_NAME_FIELD}
                  className="registration-form-control"
                  type="text"
                  value={lastName}
                  onChange={handleFormOnChange}
                  placeholder="surname"
                />
              </div>
            </div>

            <div className="mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_BIRTH_DATE_FIELD}
                className="registration-form-label"
              >
                Date of birth
              </label>
              <input
                id={FormConstants.REGISTRATION_BIRTH_DATE_FIELD}
                className="registration-form-control"
                type="date"
                onChange={handleFormOnChange}
                required
              />
            </div>

            <div className="form-group mt-2 fade-in-2s">
              <label
                htmlFor={FormConstants.REGISTRATION_EMAIL_FIELD}
                className="registration-form-label"
              >
                Email
              </label>
              <input
                id={FormConstants.REGISTRATION_EMAIL_FIELD}
                className={`registration-form-control${emailErrorStyle}`}
                type="email"
                value={email}
                onChange={handleFormOnChange}
                placeholder="example@mail.com"
                required
              />
              {emailError && <p className="mb-0">{emailError}</p>}
            </div>

            <FormPasswordInput
              id={FormConstants.REGISTRATION_PASSWORD_FIELD}
              value={password}
              label="Password"
              placeholder="your password"
              inputError={passwordError}
              inputErrorStyle={passwordErrorStyle}
              onChangeCallback={handleFormOnChange}
              divStyling={'mt-2 fade-in-2s'}
            />

            <FormPasswordInput
              id={FormConstants.REGISTRATION_REPEAT_PASSWORD_FIELD}
              value={repeatPassword}
              label="Repeat Password"
              placeholder="your password"
              inputError={repeatPasswordError}
              inputErrorStyle={repeatPasswordErrorStyle}
              onChangeCallback={handleFormOnChange}
              divStyling={'mt-2 fade-in-2s'}
            />

            <div className="form-group form-check mt-3 d-flex justify-content-between">
              <div className="">
                <input
                  id={FormConstants.REGISTRATION_TERMS_AND_CONDITIONS_CHECKBOX}
                  className="form-check-input me-3"
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
                <Link className="" to="/policy" target="_blank">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                  />
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className={`btn ${submitButtonStyle} registration-custom-button registration-form-control mt-2`}
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
            >
              Sign up
            </button>
          </form>
          <div className="text-center mt-3">
            <LoginButton
              ButtonTag={'a'}
              buttonClass={
                'btn registration-login-button registration-form-control'
              }
              buttonText={
                <>
                  Already have an account? <strong>Login</strong>
                </>
              }
            />
          </div>
        </div>
      </div>
      <div className="registration-image col-md-6 d-none d-md-block align-content-center justify-content-center ps-3">
        <img
          className="img-fluid"
          alt="noimg"
          src="/static/assets/undraw_moonlight.svg"
        ></img>
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
