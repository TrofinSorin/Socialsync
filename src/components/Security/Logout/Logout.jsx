import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from '@services/Auth';
import environment from 'environment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'center',
    margin: '0 auto',
    textAlign: 'center',
    width: '80%'
  }
}));

const Logout = props => {
  let history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    Auth.signout();

    setTimeout(() => {
      history.push('/');
      window.location.reload();
    }, environment.logoutRedirectTimeout);
  });

  return (
    <div className={classes.root}>
      <h1>
        Thank you for using Socialsync. <br /> You are now being logged out of the system.
      </h1>
    </div>
  );
};

export default Logout;
