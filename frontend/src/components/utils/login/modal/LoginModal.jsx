import React from 'react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import FormConstants from '../../../../constValues/FormConstants';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginModal.css';
import FormPasswordInput from '../../password/FormPasswordInput';
import { toast } from 'react-toastify';

const LoginModal = ({ apiPrefix, setUserData, userState, setUserState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userState) {
      navigate('/');
    }
  }, [userState, navigate]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailErrorStyle, setEmailErrorStyle] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordErrorStyle, setPasswordErrorStyle] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [warningStyle, setWarningStyle] = useState('');

  const [submitClickedOnce, setSubmitClickedOnce] = useState(false);

  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const authCheckedRef = useRef(false);

  const validateEmail = useCallback(() => {
    if (!FormConstants.EMAIL_PATTERN.test(email)) {
      setEmailError('Email has wrong format');
      setEmailErrorStyle(' wrong-input');
      return false;
    }

    setEmailError('');
    setEmailErrorStyle('');
    return true;
  }, [email]);

  const validatePassword = useCallback(() => {
    if (!FormConstants.PASSWORD_PATTERN.test(password)) {
      setPasswordError('Password has wrong format');
      setPasswordErrorStyle(' wrong-input');
      return false;
    }

    setPasswordError('');
    setPasswordErrorStyle('');
    return true;
  }, [password]);

  const validators = useMemo(
    () => [validateEmail, validatePassword],
    [validateEmail, validatePassword],
  );

  function handleFormOnChange(e) {
    setWarningStyle('');
    const { id, value } = e.target;

    switch (id) {
      case FormConstants.LOGIN_EMAIL_FIELD:
        setEmail(value);
        break;
      case FormConstants.LOGIN_PASSWORD_FIELD:
        setPassword(value);
        break;
      default:
        toast.warn('Unhandled case', {
          theme: 'dark',
          position: 'top-center',
        });
    }
  }

  function submitOnEnter(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleCheckboxChange() {
    setKeepLoggedIn((prevState) => !prevState);
  }
  const updateAlert = (toastId, setting) => {
    setIsLoading(false);

    switch (setting) {
      case 'success':
        toast.update(toastId, {
          render: 'Logged in',
          type: 'success',
          position: 'top-center',
          theme: 'dark',
          isLoading: false,
          autoClose: 1500,
        });
        break;
      case 'warning':
        toast.update(toastId, {
          render: 'Wrong credentials or user not verified',
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

  function setFormWarning() {
    setWarningStyle('text-warning');
    setEmailError('Email could be incorrect');
    setEmailErrorStyle(' warning-input');
    setPasswordError('Password could be incorrect');
    setPasswordErrorStyle(' warning-input');
  }

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
        bodyClassName: () => 'd-flex p-2 text-center',
      });

      let userLoginData = {
        [FormConstants.REGISTRATION_EMAIL_FIELD]: email,
        [FormConstants.REGISTRATION_PASSWORD_FIELD]: password,
      };

      const url = `${apiPrefix}login/`;

      axios
        .post(url, userLoginData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            updateAlert(toastId, 'success');
            setUserState(resp.data.is_authenticated);
            setUserData({
              full_name: resp.data.full_name,
              username: resp.data.username,
              user_id: resp.data.user_id,
              is_superuser: resp.data.is_superuser,
              profile_image_url: resp.data.profile_image_url,
              cookie_consent: resp.data.cookie_consent,
              is_active: resp.data.is_active,
            });

            const storage = keepLoggedIn ? localStorage : sessionStorage;
            storage.setItem('authToken', resp.data.auth_token);

            document.getElementById('quitModal').click();
          }
        })
        .catch((error) => {
          setFormWarning();
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
  }, [submitClickedOnce, validators]);

  useEffect(() => {
    if (!authCheckedRef.current) {
      const fetchAuthStatus = async () => {
        const storedToken =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        if (storedToken) {
          try {
            const resp = await axios.get(`${apiPrefix}check-auth/`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
              withCredentials: true,
            });
            if (resp.status === 200) {
              setUserState(resp.data.is_authenticated);
              setUserData({
                full_name: resp.data.full_name,
                username: resp.data.username,
                user_id: resp.data.user_id,
                is_superuser: resp.data.is_superuser,
                profile_image_url: resp.data.profile_image_url,
                cookie_consent: resp.data.cookie_consent,
                is_active: resp.data.is_active,
              });
            }
          } catch (error) {
            toast.error('Something went wrong', {
              theme: 'dark',
              position: 'top-center',
            });
          }
        }
      };

      fetchAuthStatus();
      authCheckedRef.current = true;
    }
  }, [apiPrefix, setUserData, setUserState]);

  return (
    <div
      onKeyDown={submitOnEnter}
      className="modal fade"
      id="loginModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
      data-testid="login-modal"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login backplate">
          <div className="modal-header d-block">
            <div className="d-flex col-12">
              <h1 className="modal-title fs-4" id="loginModalLabel">
                Welcome to Talis
              </h1>
              <button
                id="quitModal"
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="login-additional-info">
              Enter your username and password to log in.
            </div>
          </div>
          <div className="modal-body">
            <form
              id="login-form"
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <div className="form-group mt-2">
                <label
                  htmlFor={FormConstants.LOGIN_EMAIL_FIELD}
                  className="login-form-label"
                >
                  Email
                </label>
                <input
                  id={FormConstants.LOGIN_EMAIL_FIELD}
                  className={`login-form-control${emailErrorStyle}`}
                  type="email"
                  value={email}
                  placeholder="youremail.com"
                  onChange={handleFormOnChange}
                  required
                />
                {emailError && (
                  <p className={`mb-0 ${warningStyle}`}>{emailError}</p>
                )}
              </div>

              <FormPasswordInput
                id={FormConstants.LOGIN_PASSWORD_FIELD}
                value={password}
                label={'Password'}
                placeholder="Your password"
                inputError={passwordError}
                inputErrorStyle={passwordErrorStyle}
                warningStyle={warningStyle}
                onChangeCallback={handleFormOnChange}
                divStyling={'mt-2'}
              />

              <div className="form-group mt-3 d-flex justify-content-between align-items-center">
                <div className="custom-checkbox-container d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={handleCheckboxChange}
                    className="form-check-input"
                  />
                  <label
                    htmlFor="keepLoggedIn"
                    className="custom-checkbox-label"
                  >
                    Keep me logged in
                  </label>
                </div>
                <div
                  className="forgot-password"
                  data-bs-toggle="modal"
                  data-bs-target="#forgotPassword"
                >
                  Forgot my password
                </div>
              </div>
            </form>
          </div>
          <div className="text-center w-100 mb-3">
            <button
              type="button"
              className="modal-login login w-100"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Log in
            </button>
          </div>
          <div className="text-center w-100">
            <Link to={`/register`}>
              <button
                type="button"
                className="modal-login signup w-100"
                data-bs-dismiss="modal"
              >
                {`Don't have an account? Sign Up`}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  setUserData: PropTypes.func.isRequired,
  userState: PropTypes.bool.isRequired,
  setUserState: PropTypes.func.isRequired,
};

export default LoginModal;
