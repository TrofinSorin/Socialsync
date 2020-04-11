import React from 'react';
import Grid from '@material-ui/core/Grid';
import Login from '@components/Security/Login';
import AccountToolbar from '@components/Account/AccountToolbar/AccountToolbar';

const AccountLogin = props => {
  return (
    <React.Fragment>
      <Grid container className='full-height'>
        <AccountToolbar></AccountToolbar>
        <Login type='guest'></Login>
      </Grid>
    </React.Fragment>
  );
};

export default AccountLogin;
