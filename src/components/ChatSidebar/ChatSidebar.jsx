import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import { useSelector, useDispatch } from 'react-redux';
import * as chatbarActions from '@redux/actions/chatbarActions';
import MenuIcon from '@material-ui/icons/Menu';
import * as usersActions from '@redux/actions/usersActions';
import Loader from '../../_shared/Loader/Loader';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

const drawerWidth = 400;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4fb9fc',
    height: '7rem',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  closedToolbar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#4fb9fc',
    justifyContent: 'center',
    height: '7rem',
    minHeight: '7rem',
    padding: theme.spacing(0, 1)
    // necessary for content to be below app bar
  },
  listItem: {
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

const ChatSidebar = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const chatbarReducer = useSelector(state => state.chatbarReducer);
  const chatbarState = chatbarReducer.opened;
  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(false);

  useEffect(() => {
    dispatch(usersActions.getUsers())
      .then(result => {
        setUsers(result.data.data);
        setUserLoader(false);
      })
      .catch(err => {});
  }, []);

  const setChatbarState = state => {
    console.log('state:', state);
    dispatch(chatbarActions.toggleSidebarState(state));
  };

  return (
    <div className='ChatSidebarWrapper'>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: chatbarState,
          [classes.drawerClose]: !chatbarState
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: chatbarState,
            [classes.drawerClose]: !chatbarState
          })
        }}>
        {!chatbarState ? (
          <>
            <div onClick={() => setChatbarState(true)} className={classes.closedToolbar}>
              <MenuIcon style={{ fontSize: '3rem', cursor: 'pointer' }}></MenuIcon>
            </div>
          </>
        ) : (
          <>
            <div className={classes.toolbar}>
              <h2>Chat Sidebar</h2>
              <IconButton style={{ fontSize: '3rem' }} onClick={() => setChatbarState(false)}>
                {theme.direction === 'ltl' ? (
                  <ChevronRightIcon style={{ fontSize: '3rem' }} />
                ) : (
                  <ChevronLeftIcon style={{ fontSize: '3rem' }} />
                )}
              </IconButton>
            </div>
          </>
        )}
        {userLoader ? (
          <Loader></Loader>
        ) : (
          <Grid style={{ height: '100%' }} container>
            <Grid style={{ height: '100%' }} item xs={chatbarState ? 3 : 12}>
              <List style={{ backgroundColor: '#F7F7F7', height: '100%', padding: '0' }}>
                {users.map((user, index) => (
                  <ListItem className={classes.listItem} key={user.id}>
                    <Tooltip
                      title={
                        <span
                          style={{ fontSize: '1.3rem', padding: '1rem' }}>{`${user.firstname} ${user.lastname}`}</span>
                      }
                      placement='right'>
                      <StyledBadge
                        style={{ cursor: 'pointer', color: 'red' }}
                        overlap='circle'
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        onClick={() => setChatbarState(true)}
                        variant='dot'>
                        <Avatar
                          style={{ backgroundColor: '#FF5722' }}
                          alt={user.firstname}
                          src={user.avatar ? user.avatar : null}>
                          {user.firstname.charAt(0) + user.lastname.charAt(0)}
                        </Avatar>
                      </StyledBadge>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {chatbarState ? (
              <Grid item>
                <p>Chat</p>
              </Grid>
            ) : null}
          </Grid>
        )}
      </Drawer>
    </div>
  );
};

export default ChatSidebar;
