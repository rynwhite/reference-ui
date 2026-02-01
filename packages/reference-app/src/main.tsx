import React from 'react';
import ReactDOM from 'react-dom/client';
import '@reference-ui/core'; // register design system (RefButton, etc.)
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
