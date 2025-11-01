import React from 'react';
import './Login.css';

const Login = ({ onLogin }) => (
  <div className="login-container">
    <div className="login-card">
      <img src="/logo592.png" alt="App Logo" className="login-logo" />
      <h2 className="login-title">Welcome to LinkHub</h2>
      <p className="login-subtitle">Please login to access your dashboard</p>
      <button className="login-button" onClick={onLogin}>
        Login
      </button>
    </div>
  </div>
);

export default Login;
