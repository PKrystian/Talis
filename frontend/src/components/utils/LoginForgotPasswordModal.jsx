import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormConstants from '../../constValues/FormConstants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForgotPasswordModal.css';
import { FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const LoginForgotPasswordModal = ({ apiPrefix, userState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userState) {
      navigate('/');
    }
  }, [userState, navigate]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailErrorStyle, setEmailErrorStyle] = useState('');
  const [submitClickedOnce, setSubmitClickedOnce] = useState(false);

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

  function handleFormOnChange(e) {
    setEmail(e.target.value);
  }

  function submitOnEnter(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleSubmit() {
    setSubmitClickedOnce(true);

    if (validateEmail()) {
      let userForgotPasswordData = {
        [FormConstants.REGISTRATION_EMAIL_FIELD]: email,
      };

      const url = `${apiPrefix}check-email/`;

      axios
        .post(url, userForgotPasswordData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((resp) => {
          if (resp.status === 200) {
            if (resp.data.validate) {
              document.getElementById('quitForgotPassword').click();
              toast.success('Password reset link sent', {
                position: 'top-center',
                theme: 'dark',
                bodyClassName: () => 'd-flex p-2 text-center',
              });
            }
          }
        })
        .catch((error) => {
          console.error(error.message);
          setEmailError('Email doesnt exist');
          setEmailErrorStyle(' wrong-input');
        });
    }
  }

  useEffect(() => {
    if (submitClickedOnce) {
      validateEmail();
    }
  }, [submitClickedOnce, validateEmail]);

  return (
    <div
      onKeyDown={submitOnEnter}
      className="modal fade"
      id="forgotPassword"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="forgotPasswordLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content backplate">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="forgotPasswordLabel">
              Forgot my password
            </h1>
            <button
              id="quitForgotPassword"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form
              id="forgot-password-form"
              className="mb-4"
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <div className="form-group mt-2">
                <label htmlFor={'forgotPasswordEmail'} className="form-label">
                  Email
                </label>
                <input
                  id={'forgotPasswordEmail'}
                  className={`form-control${emailErrorStyle}`}
                  type="email"
                  value={email}
                  onChange={handleFormOnChange}
                  required
                />
                {emailError && <p className="mb-0">{emailError}</p>}
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button
              className="forgot-password bg-transparent border-0"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              <div className="forgot-password d-flex align-items-center">
                <FaArrowLeft className="me-2" />
                <div>Back to Login</div>
              </div>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Send reset request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginForgotPasswordModal.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  userState: PropTypes.bool.isRequired,
};

export default LoginForgotPasswordModal;
