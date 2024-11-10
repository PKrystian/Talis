import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const TopScreenAlert = ({
  alertMessage,
  alertType,
  showAlert,
  onDismissAlert,
}) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    setIsAlertVisible(showAlert);
  }, [showAlert]);

  return (
    <div className="p-0 what">
      {isAlertVisible && (
        <div
          className={`alert alert-${alertType} w-50 alert-dismissible fade-in-2s`}
          role="alert"
        >
          <div className="d-flex justify-content-center fs-5">
            {alertMessage}
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onDismissAlert}
          ></button>
        </div>
      )}
    </div>
  );
};

TopScreenAlert.propTypes = {
  toggle: PropTypes.string,
}.isRequired;

export default TopScreenAlert;
