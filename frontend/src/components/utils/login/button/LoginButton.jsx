import React from 'react';
import PropTypes from 'prop-types';
import './LoginButton.css';

const LoginButton = ({ buttonClass, buttonText, ButtonTag }) => {
  return (
    <ButtonTag
      className={buttonClass}
      data-bs-toggle="modal"
      data-bs-target="#loginModal"
    >
      {buttonText}
    </ButtonTag>
  );
};

LoginButton.propTypes = {
  buttonClass: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  ButtonTag: PropTypes.string.isRequired,
}.isRequired;

export default LoginButton;
