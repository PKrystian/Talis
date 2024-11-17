import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import FormConstants from '../../constValues/FormConstants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginModal.css';
import FormPasswordInput from './inputFields/FormPasswordInput';
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
    const { id, value } = e.target;

    switch (id) {
      case FormConstants.LOGIN_EMAIL_FIELD:
        setEmail(value);
        break;
      case FormConstants.LOGIN_PASSWORD_FIELD:
        setPassword(value);
        break;
      default:
        console.warn(`Unhandled case: ${id}`);
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
            setUserState(resp.data.is_authenticated);
            setUserData({
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
          console.error(error);
          setFormWarning();
          toast.warn('Wrong credentials or user not verified', {
            position: 'top-center',
            theme: 'dark',
            bodyClassName: () => 'd-flex p-2 text-center',
          });
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
                username: resp.data.username,
                user_id: resp.data.user_id,
                is_superuser: resp.data.is_superuser,
                profile_image_url: resp.data.profile_image_url,
                cookie_consent: resp.data.cookie_consent,
                is_active: resp.data.is_active,
              });
            }
          } catch (error) {
            console.error('Error fetching user authentication', error);
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
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content backplate">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="loginModalLabel">
              Login
            </h1>
            <button
              id="quitModal"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
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
          <div className="modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Login
            </button>
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
