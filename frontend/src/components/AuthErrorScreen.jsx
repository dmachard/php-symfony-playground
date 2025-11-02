import React from 'react';

const AuthErrorScreen = ({ error, onRetry }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-danger text-center">
      <i className="bi bi-exclamation-triangle-fill mb-3" style={{ fontSize: '3rem' }}></i>
      <h4>Authentication Error</h4>
      <p className="text-muted mb-4">{error?.message || 'An unknown error occurred.'}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        Retry Login
      </button>
    </div>
  );
};

export default AuthErrorScreen;
