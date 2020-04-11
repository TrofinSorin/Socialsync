import React from 'react';
import Auth from '@services/Auth';
import LoggedAccount from './LoggedAccount/LoggedAccount';
import AccountToolbar from './AccountToolbar/AccountToolbar';

const Account = ({ match }) => {
  return (
    <React.Fragment>
      <AccountToolbar></AccountToolbar>
      <LoggedAccount match={match}></LoggedAccount>
    </React.Fragment>
  );
};

export default Account;
