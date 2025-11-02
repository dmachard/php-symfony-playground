import React from 'react';

const LoadingScreen = ({ message = 'Authenticating...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-secondary">
      <div
        className="spinner-border text-primary mb-4"
        role="status"
        style={{ width: '4rem', height: '4rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4>{message}</h4>
      <p className="text-muted">Please wait while we securely connect you to LinkHub.</p>
    </div>
  );
};

export default LoadingScreen;
