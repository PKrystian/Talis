import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CookieConsentModal.css';

const CookieConsentModal = ({ apiPrefix, user, setUser }) => {
  const [cookieConsent, setCookieConsent] = useState(user.cookie_consent);
  const [showPolicy, setShowPolicy] = useState(false);

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
        {showPolicy ? (
          <div className="policy-container">
            <h2 id="cookie-content" className="policy-header">
              Cookie Policy
            </h2>
            <p className="policy-paragraph">
              We use cookies solely to enhance your experience on our website.
              Our cookies are used for user authentication during login and
              registration processes, as well as for saving preferences related
              to board games.
            </p>
            <p className="policy-paragraph">
              Here are the types of cookies we use:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to
                function, such as cookies for user authentication and
                preferences.
              </li>
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that are
                deleted when you close your browser. These help maintain your
                session while navigating the site.
              </li>
            </ul>
            <p className="policy-paragraph">
              You can manage your cookie preferences through your browser
              settings. However, please note that disabling cookies may affect
              your ability to use certain features of our website.
            </p>
            <button
              onClick={() => setShowPolicy(false)}
              className="btn btn-secondary"
            >
              Back
            </button>
          </div>
        ) : (
          <>
            <p>
              We use cookies to enhance your experience. Please review our{' '}
              <button
                onClick={() => setShowPolicy(true)}
                className="btn btn-link"
              >
                Cookie Policy
              </button>{' '}
              and make a choice.
            </p>
            <div className="modal-buttons">
              <button
                onClick={() => handleConsentDecision(true)}
                className="btn btn-primary"
              >
                Accept
              </button>
            </div>
          </>
        )}
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
