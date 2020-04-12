import React from 'react';
import AccountToolbar from './AccountToolbar/AccountToolbar';
import Profile from './Profile/Profile';

const Account = ({ match }) => {
  return (
    <React.Fragment>
      <AccountToolbar></AccountToolbar>
      <Profile match={match}></Profile>
    </React.Fragment>
  );
};

export default Account;
