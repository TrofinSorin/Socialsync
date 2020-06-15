import React, { useEffect, useRef, useState } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './Menu.scss';
import HomeIcon from '@assets/icons/raw/homeIcon';
import UserIcon from '@assets/icons/raw/userIcon';
import ChatIcon from '@material-ui/icons/Chat';
import mainLogo from '@assets/images/logo_single.png';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Auth from '@services/Auth';
import { Link, useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as usersActions from '@redux/actions/usersActions';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
  },
  input: {
    marginLeft: theme.spacing(1),
    height: '3rem',
    fontSize: '1.6rem',
    flex: 1,
    '& .MuiAutocomplete-inputRoot': {
      '&::before': {
        display: 'none'
      },
      '&::after': {
        display: 'none'
      }
    },
    '& input': {
      fontSize: '1.6rem'
    }
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
  const [anchorEl, setAnchorEl] = useState(null);
  let history = useHistory();
  const { user, usersToSelectFrom } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();
  const autocompleteRef = useRef(null);
  const [value, setValue] = React.useState(null);

  const onChange = event => {
    setValue(event.target.value);
  };

  const setUserChangeHandler = (event, selectedUser) => {
    if (selectedUser) {
      setTimeout(() => {
        history.replace(`/profile/${selectedUser.id}`);
      });
    }
  };

  const setUserSelectedClickHandler = selectedUser => {
    setTimeout(() => {
      history.push(`/profile/${selectedUser.id}`);
    });
  };

  /*eslint-disable */
  useEffect(() => {
    dispatch(usersActions.getUsersToSelectFrom(value));
  }, [value]);
  /*eslint-enable */

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
          <div className='autocomplete-wrapper'>
            <Autocomplete
              id='highlights-demo'
              ref={autocompleteRef}
              style={{ width: 300 }}
              options={usersToSelectFrom.filter(item => item.id !== user.id)}
              getOptionLabel={option => `${option.firstname} ${option.lastname}`}
              onChange={(event, value) => setUserChangeHandler(event, value)}
              renderInput={params => (
                <Paper component='form' className={classes.root}>
                  <TextField
                    {...params}
                    style={{ fontSize: '1.9rem' }}
                    onChange={onChange}
                    className={classes.input}
                    placeholder='Search Friends'
                  />
                  <IconButton type='submit' className={classes.iconButton} aria-label='search'>
                    <SearchIcon />
                  </IconButton>
                </Paper>
              )}
              renderOption={option => {
                return (
                  <div
                    onClick={() => setUserSelectedClickHandler(option)}
                    tabIndex='0'
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      style={{ marginRight: '1rem' }}
                      src={option.avatar}
                      name={option.firstname}
                      size={200}
                      round='50px'
                    />
                    <span style={{ marginRight: '.5rem' }}>{option.firstname}</span>
                    <span>{option.lastname}</span>
                  </div>
                );
              }}
            />
          </div>

          <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
            {Object.keys(user).length > 0 ? (
              <Avatar
                style={{ backgroundColor: '#FF5722' }}
                alt={user.firstname}
                src={user.avatar ? user.avatar : null}>
                {user.firstname.charAt(0) + user.lastname.charAt(0)}
              </Avatar>
            ) : (
              ''
            )}
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
