import React from 'react';
import PropTypes from 'prop-types';
//import { Test } from './AccountToolbar.styles';
import Img from '@shared/Images/Images';
import Grid from '@material-ui/core/Grid';
import gearIcon from '@assets/icons/gear.svg';
import Auth from '@services/Auth';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';

const AccountToolbar = props => {
  let history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    history.push('/logout');
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid container className='top-bar layout-row align-items-center'>
          <Grid item xs={10} className='layout-row justify-content-center'>
            <h1>Account</h1>
          </Grid>
          <Grid item xs={2}>
            <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
              <Img src={gearIcon} alt='Settings icon' />
            </Button>
            <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={null}>Profile</MenuItem>
              {Auth.getUser().accessToken ? <MenuItem onClick={() => logout()}>Logout</MenuItem> : null}
            </Menu>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

AccountToolbar.propTypes = {
  // bla: PropTypes.string,
};

AccountToolbar.defaultProps = {
  // bla: 'test',
};

export default AccountToolbar;
