import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './components/Home';
import Auth from '@services/Auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Security from './components/Security/Security';
import ChatRoom from './components/ChatRoom/ChatRoom';
import Account from './components/Account/Account';
import Logout from './components/Security/Logout/Logout';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
}));

const Router = props => (
  <React.Fragment>
    <Switch>
      <Route path='/home' component={Home} />
      <Route path='/chat-room' component={ChatRoom} />
      <Route path='/profile' component={Account} />
      <Route path='/logout' component={Logout} />
      <Route path='/' component={Security} />
      <Redirect to='/' />
    </Switch>
  </React.Fragment>
);

export const PrivateRoute = ({ component: Component, action: Action, cancel: Cancel, ...rest }) => {
  const [loaded, setLoaded] = useState(null);
  const [resolverData, setResolverData] = useState(null);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    let isSubscribed = true;

    if (Action) {
      dispatch(Action).then(result => {
        if (result && isSubscribed) {
          setResolverData(result);
          setLoaded(true);
        }
      });
    } else {
      setLoaded(true);
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (!loaded)
    return (
      <React.Fragment>
        <div className={classes.root}>
          <CircularProgress />
        </div>
      </React.Fragment>
    );

  return (
    <Route
      {...rest}
      render={props =>
        Auth.isAuthenticated ? (
          <Component resolverData={resolverData ? resolverData.data : null} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/'
            }}
          />
        )
      }
    />
  );
};

export default Router;
