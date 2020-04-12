import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './Menu.scss';
import HomeIcon from '@assets/icons/raw/homeIcon';
import UserIcon from '@assets/icons/raw/userIcon';
import ChatIcon from '@material-ui/icons/Chat';

const Menu = props => {
  const { location } = props;

  if (
    location.pathname === '/' ||
    location.pathname.match(/\/login/) ||
    location.pathname.match(/\/forgot-password/) ||
    location.pathname.match(/\/create/) ||
    location.pathname.match(/\/logout/)
  ) {
    return null;
  }

  return (
    <div className='MenuWrapper'>
      <section className='menu'>
        <h1>Socialsync</h1>
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

export default withRouter(Menu);
