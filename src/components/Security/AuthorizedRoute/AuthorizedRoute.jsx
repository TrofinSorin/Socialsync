import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from '@services/Auth';

const AuthorizedRoute = props => {
  const { component: Component, pending, logged, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props => {
        return Auth.getUser() ? <Component {...props} /> : <Redirect to='/' />;
      }}
    />
  );
};

AuthorizedRoute.propTypes = {
  // bla: PropTypes.string,
};

AuthorizedRoute.defaultProps = {
  // bla: 'test',
};

export default AuthorizedRoute;
