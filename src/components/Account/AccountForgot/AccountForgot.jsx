import React from 'react';
import AccountToolbar from '@components/Account/AccountToolbar/AccountToolbar';
import Grid from '@material-ui/core/Grid';
import ForgotPassword from '@components/Security/ForgotPassword/ForgotPassword';

const AccountForgot = props => (
  <React.Fragment>
    <Grid container className='full-height'>
      <AccountToolbar></AccountToolbar>
      <ForgotPassword type='guest'></ForgotPassword>
    </Grid>
  </React.Fragment>
);

AccountForgot.propTypes = {
  // bla: PropTypes.string,
};

AccountForgot.defaultProps = {
  // bla: 'test',
};

export default AccountForgot;
