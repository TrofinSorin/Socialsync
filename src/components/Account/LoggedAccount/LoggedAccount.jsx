import React from 'react';
import Grid from '@material-ui/core/Grid';
import './LoggedAccount.scss';

const LoggedAccount = props => {
  return (
    <React.Fragment>
      <Grid container className='logged-account athens-gray-bk'>
        Logged Account
      </Grid>
    </React.Fragment>
  );
};

LoggedAccount.propTypes = {
  // bla: PropTypes.string,
};

LoggedAccount.defaultProps = {
  // bla: 'test',
};

export default LoggedAccount;
