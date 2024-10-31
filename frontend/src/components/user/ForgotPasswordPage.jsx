import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ForgotPasswordPage.css';
import FormConstants from '../../FormConstants';
import FormPasswordInput from '../utils/inputFields/FormPasswordInput';

const ForgotPasswordPage = ({ apiPrefix, userState }) => {
  const navigate = useNavigate();
  const { token } = useParams();

  if (userState) {
    navigate('/');
  }

  useEffect(() => {
    axios.get(apiPrefix + `check-access/${token}/`).catch((error) => {
      navigate('/');
      console.error('Error getting access:', error);
    });
  }, []);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordErrorStyle, setPasswordErrorStyle] = useState('');

  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [repeatPasswordErrorStyle, setRepeatPasswordErrorStyle] = useState('');

  const [submitClickedOnce, setSubmitClickedOnce] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const [submitButtonStyle, setSubmitButtonStyle] = useState(
    'btn-outline-secondary',
  );

  const setterMap = {
    forgotPasswordField: setPassword,
    forgotRepeatPasswordField: setRepeatPassword,
  };

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

    setIsFormValid(true);
  }

  function handleFormOnChange(e) {
    let key = e.target.id;
    let value = e.target.value;

    setterMap[key](value);
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

    if (validatePassword() && isFormValid) {
      let data = {
        token: token,
        [FormConstants.REGISTRATION_PASSWORD_FIELD]: password,
      };

      let url = apiPrefix + 'change-password/';

      axios
        .post(url, data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((resp) => {
          if (resp.data.validate === true) {
            navigate('/');
          }
        });
    }
  }

  useEffect(() => {
    if (submitClickedOnce) {
      validatePassword();
    }
    validateForm();
  }, [password, repeatPassword]);

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="backplate fade-in-1s">
        <div className="mt-4 mb-4 mx-5">
          <h2>Reset Password</h2>
          <hr></hr>
          <form
            id="new-password-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <FormPasswordInput
              id={'forgotPasswordField'}
              value={password}
              label={'Password'}
              inputError={passwordError}
              inputErrorStyle={passwordErrorStyle}
              onChangeCallback={handleFormOnChange}
            />

            <FormPasswordInput
              id={'forgotRepeatPasswordField'}
              value={repeatPassword}
              label={'Repeat Password'}
              inputError={repeatPasswordError}
              inputErrorStyle={repeatPasswordErrorStyle}
              onChangeCallback={handleFormOnChange}
            />
            <button
              type="submit"
              className={`btn ${submitButtonStyle} form-control mt-4`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Set new password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

ForgotPasswordPage.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  userState: PropTypes.bool.isRequired,
}.isRequired;

export default ForgotPasswordPage;
