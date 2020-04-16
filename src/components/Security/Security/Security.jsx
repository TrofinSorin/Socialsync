import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from '../Login';
import ForgotPassword from '../ForgotPassword';
import CreateAccount from '../CreateAccount';
import SetPassword from '@components/Security/SetPassword';

const Security = ({ match }) => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={`${match.path}login`} component={Login} />
        <Route path={`${match.path}forgot-password`} component={ForgotPassword} />
        <Route path={`${match.path}create`} component={CreateAccount} />
        <Route path={`${match.path}set-password/:id/:token`} component={SetPassword} />
        <Redirect to={`${match.path}login`} />
      </Switch>
    </React.Fragment>
  );
};

export default Security;
