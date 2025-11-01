import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  authority: process.env.REACT_APP_AUTH_OIDC_DOMAIN,
  client_id: process.env.REACT_APP_AUTH_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email",
  audience: process.env.REACT_APP_AUTH_OIDC_AUDIENCE,
  automaticSilentRenew: true,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
  
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  post_logout_redirect_uri: window.location.origin,
  onSignoutCallback: () => {
    window.location.href = '/';
  }
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
