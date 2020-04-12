import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Profile.scss';

const Profile = props => {
  return (
    <React.Fragment>
      <Grid container className='logged-account'>
        Logged Account
      </Grid>
    </React.Fragment>
  );
};

Profile.propTypes = {
  // bla: PropTypes.string,
};

Profile.defaultProps = {
  // bla: 'test',
};

export default Profile;
