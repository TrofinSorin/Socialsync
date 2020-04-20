import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './Menu.scss';
import HomeIcon from '@assets/icons/raw/homeIcon';
import UserIcon from '@assets/icons/raw/userIcon';
import ChatIcon from '@material-ui/icons/Chat';
import mainLogo from '@assets/images/logo_single.png';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Auth from '@services/Auth';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 0,
    '& svg': {
      width: '2rem',
      height: '2rem'
    }
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

const MenuComponent = props => {
  const { location } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  let history = useHistory();
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    history.push('/logout');
  };

  if (
    location.pathname === '/' ||
    location.pathname.match(/\/login/) ||
    location.pathname.match(/\/forgot-password/) ||
    location.pathname.match(/\/create/) ||
    location.pathname.match(/\/logout/) ||
    location.pathname.match(/\/set-password/)
  ) {
    return null;
  }

  return (
    <div className='MenuWrapper'>
      <section className='menu'>
        <div className='toolbar'>
          <img style={{ height: '5rem' }} src={mainLogo} alt='mainLogo' />
          <Paper component='form' className={classes.root}>
            <InputBase
              style={{ fontSize: '1.6rem' }}
              className={classes.input}
              placeholder='Search Friends'
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type='submit' className={classes.iconButton} aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
            Settings
          </Button>
          <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem>Profile</MenuItem>
            {Auth.getUser().accessToken ? <MenuItem onClick={() => logout()}>Logout</MenuItem> : null}
          </Menu>
        </div>
        <div className='links'>
          <NavLink to='/home' activeClassName='is-active'>
            <HomeIcon></HomeIcon>
            <span>Home</span>
          </NavLink>
          <NavLink to='/chat-room' activeClassName='is-active'>
            <ChatIcon style={{ fontSize: '3rem' }}></ChatIcon>
            <span>ChatRoom</span>
          </NavLink>
          <NavLink to='/profile' activeClassName='is-active'>
            <UserIcon></UserIcon>
            <span>Profile</span>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default withRouter(MenuComponent);
