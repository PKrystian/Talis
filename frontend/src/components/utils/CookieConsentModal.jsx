import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CookieConsentModal.css';

const CookieConsentModal = ({ apiPrefix, user, setUser }) => {
  const [cookieConsent, setCookieConsent] = useState(user.cookie_consent);

  useEffect(() => {
    if (cookieConsent === null) {
      axios
        .get(`${apiPrefix}check-cookie-consent/`, {
          params: {
            user_id: user.user_id,
          },
        })
        .then((response) => {
          setCookieConsent(response.data.cookie_consent);
        })
        .catch((error) =>
          console.error('Error fetching cookie consent:', error),
        );
    }
  }, [apiPrefix, cookieConsent, user.user_id]);

  const handleConsentDecision = (decision) => {
    axios
      .post(
        `${apiPrefix}change-cookie-consent/`,
        {
          cookie_consent: decision,
          user_id: user.user_id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((response) => {
        setCookieConsent(decision);
        setUser((prevUser) => ({
          ...prevUser,
          cookie_consent: decision,
        }));
      })
      .catch((error) => console.error('Error updating cookie consent:', error));
  };

  if (cookieConsent !== null) return null;

  return (
    <div className="cookie-consent-modal-overlay">
      <div className="cookie-consent-modal">
        <h2>Cookie Consent</h2>
        <p>
          We use cookies to enhance your experience. Please review our{' '}
          <Link
            to="/policy#cookie-content"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cookie Policy
          </Link>{' '}
          and make a choice.
        </p>
        <div className="modal-buttons d-flex justify-content-center">
          <button
            onClick={() => handleConsentDecision(true)}
            className="btn btn-primary"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

CookieConsentModal.propTypes = {
  apiPrefix: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default CookieConsentModal;
