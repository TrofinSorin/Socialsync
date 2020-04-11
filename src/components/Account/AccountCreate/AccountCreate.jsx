import React from 'react';
import Grid from '@material-ui/core/Grid';
import CreateAccount from '@components/Security/CreateAccount/CreateAccount';
import AccountToolbar from '@components/Account/AccountToolbar/AccountToolbar';

const AccountCreate = props => (
  <React.Fragment>
    <Grid container className='full-height'>
      <AccountToolbar></AccountToolbar>
      <CreateAccount type='guest'></CreateAccount>
    </Grid>
  </React.Fragment>
);

AccountCreate.propTypes = {
  // bla: PropTypes.string,
};

AccountCreate.defaultProps = {
  // bla: 'test',
};

export default AccountCreate;
