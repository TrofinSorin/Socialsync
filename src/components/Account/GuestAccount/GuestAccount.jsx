import React from 'react';
import { Link } from 'react-router-dom';
import { headerLogoTransparent } from '@shared/Base64Images';
import ButtonComponent from '@shared/ButtonComponent';
import Img from '@shared/Images/Images';
import Grid from '@material-ui/core/Grid';
import './GuestAccount.scss';

const GuestAccount = ({ match }) => {
  return (
    <Grid container className='login-account athens-gray-bk'>
      <Img src={headerLogoTransparent} className='full-width' />
      <Grid container item justify='center'>
        <Grid item xs={7}>
          <p className='header-info'>Order to-go food from restaurants making earth-friendly packaging choices.</p>
        </Grid>
        <Grid item xs={12} className='content-wrap text-center'>
          <Link to={`${match.path}/login`}>
            <ButtonComponent type='btn-primary'>Sign in</ButtonComponent>
          </Link>

          <Grid container className='bottom-section'>
            <Grid item xs>
              <span>Don't have an account? </span>
              <Link to={`${match.path}/create`}>Create account</Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

GuestAccount.propTypes = {
  // bla: PropTypes.string,
};

GuestAccount.defaultProps = {
  // bla: 'test',
};

export default GuestAccount;
