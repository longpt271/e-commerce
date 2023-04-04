import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap Bundle JS

import './index.css';
import store from 'store';
import { ApiContextProvider } from 'context/ApiContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ApiContextProvider>
      <App />
    </ApiContextProvider>
  </Provider>
);
