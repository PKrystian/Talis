import React from 'react';
import './AccountVerificationModal.css';

const AccountVerificationModal = () => {
  document.body.classList.add('body-account-not-verified');

  return (
    <div className="verification-card-overlay">
      <div className="verification-card-modal m-3">
        <h3>Account verification link has been sent to your email</h3>
        <div className="mt-4">
          Click the link there to verify and gain access to your account
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationModal;
