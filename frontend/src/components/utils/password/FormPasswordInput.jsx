import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import './FormPasswordInput.css';

const FormPasswordInput = ({
  id,
  value,
  label,
  placeholder = '',
  inputError,
  inputErrorStyle,
  warningStyle = '',
  onChangeCallback,
  divStyling,
}) => {
  const typeText = 'text';
  const typePassword = 'password';

  const [currentVisibility, setCurrentVisibility] = useState(typePassword);
  const [currentIcon, setCurrentIcon] = useState(<FaEyeSlash />);

  const toggleFieldVisible = () => {
    switch (currentVisibility) {
      case typeText:
        setCurrentVisibility(typePassword);
        setCurrentIcon(<FaEyeSlash />);
        break;
      case typePassword:
        setCurrentVisibility(typeText);
        setCurrentIcon(<FaEye />);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`form-group ${divStyling}`}>
      <label htmlFor={id} className="registration-form-label">
        {label}
      </label>
      <div className="position-relative">
        <input
          id={id}
          className={`registration-form-control${inputErrorStyle}`}
          type={currentVisibility}
          value={value}
          onChange={onChangeCallback}
          placeholder={placeholder}
          required
        />
        <div
          className="position-absolute top-50 end-0 translate-middle-y me-2"
          role="button"
          onClick={toggleFieldVisible}
        >
          {currentIcon}
        </div>
      </div>
      {inputError && <p className={`mb-0 ${warningStyle}`}>{inputError}</p>}
    </div>
  );
};

FormPasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  inputError: PropTypes.string,
  inputErrorStyle: PropTypes.string,
  warningStyle: PropTypes.string,
  onChangeCallback: PropTypes.func,
  divStyling: PropTypes.string,
};

export default FormPasswordInput;
