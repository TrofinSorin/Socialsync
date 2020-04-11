import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import { getHeader } from '@services/WSSE/index';
import axios from 'axios';
import { HTTP_CODES } from './constants/http-codes';
import * as snackbarActions from '@redux/actions/snackbarActions';
import Auth from '@services/Auth';

const history = createBrowserHistory();
const store = configureStore();
const { dispatch } = store;

axios.interceptors.request.use(
  function(config) {
    config.headers = { ...config.headers };
    // you can also do other modification in config

    if (config.url.indexOf('secured') > 1) {
      const getUser = Auth.getUser();
      const accessToken = getUser.accessToken;
      const username = getUser.username;

      const header = getHeader(accessToken, username);
      config.headers['X-WSSE'] = header;
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async response => {
    if (response.status === HTTP_CODES.OK) {
      // console.log('WORKS 200');
    }

    switch (response.status) {
      case HTTP_CODES.OK:
        break;
      case HTTP_CODES.CREATED:
        console.log('200 and 201', response);
        dispatch(snackbarActions.setSnackbarMessage('MESSAGE FROM SERVICE', 'success'));

        break;

      default:
        break;
    }

    return response;
  },
  async error => {
    const status = error.response && error.response.status ? error.response.status : null;

    switch (status) {
      case HTTP_CODES.BAD_REQUEST:
      case HTTP_CODES.UNAUTHORIZED:
      case HTTP_CODES.FORBIDDEN:
      case HTTP_CODES.NOT_FOUND:
      case HTTP_CODES.INTERNAL_SERVER_ERROR:
        dispatch(snackbarActions.setSnackbarMessage(error.message, 'error'));
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

ReactDOM.render(
  <BrowserRouter history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
