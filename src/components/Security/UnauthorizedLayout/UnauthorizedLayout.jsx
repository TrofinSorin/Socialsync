import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SplashScreen from '../../layout/SplashScreen';

const UnauthorizedLayout = ({ match }) => {
  return (
    <div className='unauthorized-layout'>
      <Switch>
        <Route path={match.url} component={SplashScreen}></Route>
        <Redirect to='/' />
      </Switch>
    </div>
  );
};

export default UnauthorizedLayout;
