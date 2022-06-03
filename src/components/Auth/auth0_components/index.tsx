import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const config = {
  domain: 'dev--43nlze0.us.auth0.com',
  clientId: 'A4RcIxmwDyxDemRJWLM5GM8sAztY7spw',
  audience: 'https://dev--43nlze0.us.auth0.com/api/v2/',
  scope: 'read:current_user update:current_user_metadata',
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Auth0Provider {...config} redirectUri={window.location.origin}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
);

export function App() {
  return <div>app component</div>;
}
