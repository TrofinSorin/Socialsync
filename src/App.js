import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.scss';
import Router from './Router';
import Menu from './components/Menu';
import * as usersActions from '@redux/actions/usersActions';
import Auth from '@services/Auth';
import { useHistory } from 'react-router-dom';
import SnackBarComponent from './_shared/SnackBarComponent/SnackBarComponent';

function App() {
  Auth.init();
  let history = useHistory();

  const dispatch = useDispatch();
  const getUserOnAppRefresh = () => {
    const getUser = Auth.getUser();

    if (Auth.getUser().accessToken) {
      dispatch(usersActions.getUser(getUser.loginUser.id))
        .then(result => {
          Auth.update(result.data);
        })
        .catch(err => {
          Auth.reset();
          history.push('/login');

          window.location.reload();
        });
    } else {
      Auth.reset();
      history.push('/login');
    }
  };

  /*eslint-disable */
  useEffect(() => {
    getUserOnAppRefresh();
  }, []);
  /*eslint-enable */

  return (
    <React.Fragment>
      <Router></Router>
      <Menu></Menu>
      <SnackBarComponent></SnackBarComponent>
    </React.Fragment>
  );
}

export default App;
