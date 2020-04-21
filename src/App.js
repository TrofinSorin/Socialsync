import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.scss';
import Router from './Router';
import MenuComponent from './components/Menu';
import * as usersActions from '@redux/actions/usersActions';
import Auth from '@services/Auth';
import { useHistory } from 'react-router-dom';
import SnackBarComponent from './_shared/SnackBarComponent/SnackBarComponent';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  Auth.init();
  let history = useHistory();
  const dispatch = useDispatch();

  const getUserOnAppRefresh = () => {
    const getUser = Auth.getUser().loginUser;

    if (Auth.getUser().accessToken) {
      dispatch(usersActions.getUser(getUser.id))
        .then(result => {
          Auth.update(result.data);
        })
        .catch(err => {
          Auth.reset();
          history.push('/security/login');
          window.location.reload();
        });
    } else {
      if (!window.location.pathname.includes('/security/')) {
        history.push('/security/login');
      }
    }
  };

  /*eslint-disable */
  useEffect(() => {
    getUserOnAppRefresh();
  }, []);
  /*eslint-enable */

  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {Auth.getUser().accessToken ? <ChatSidebar></ChatSidebar> : null}
        <div style={{ width: '100%' }}>
          <MenuComponent></MenuComponent>
          <Router></Router>
        </div>
      </div>

      <SnackBarComponent></SnackBarComponent>
    </React.Fragment>
  );
}

export default App;
