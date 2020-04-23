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
import useSocket from 'use-socket.io-client';
import formSerialize from 'form-serialize';
import { useImmer } from 'use-immer';
import './ChatSidebar.scss';

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: props => props.colorstatus,
    color: props => props.colorstatus,
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
  const userReducer = useSelector(state => state.usersReducer);
  const chatbarState = chatbarReducer.opened;
  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(false);
  const [user, setUser] = useState({});
  const [userSelected, setUserSelected] = useState({});
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useImmer([]);
  const [socket] = useSocket('http://localhost:8001', {
    autoConnect: false
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUsersToShow, setOnlineUsersToShow] = useState([]);

  socket.connect();

  /*eslint-disable */
  useEffect(() => {
    dispatch(usersActions.getUsers())
      .then(result => {
        setUsers(result.data.data);
        setUserLoader(false);
      })
      .catch(err => {});

    return () => socket.disconnect();
  }, []);
  /*eslint-enable */

  useEffect(() => {
    if (userReducer.user && Object.keys(userReducer.user).length > 0) {
      setUser(userReducer.user);

      console.log('userReducer.user.id:', userReducer.user.id);
      socket.emit('login', { userId: userReducer.user.id });
      socket.emit('getOnlineUsers');

      socket.on('chat message', data => {
        setMessages(draft => {
          draft.push({
            from: `${data.from}`,
            message: data.message,
            username: data.username,
            thumb: data.thumb,
            room: room
          });
        });

        var lastMesage = document.getElementsByClassName('conversation')[0].lastChild;
        lastMesage.scrollIntoView(false);
      });

      socket.on('getOnlineUsers', data => {
        setOnlineUsers([]);

        const onlineUsers = [];

        Object.keys(data).forEach(socket => {
          onlineUsers.push({
            userId: data[socket],
            socket: socket
          });
        });

        setOnlineUsers(onlineUsers);
      });

      socket.on('disconnect', data => {
        console.log('data:', data);
        socket.emit('getOnlineUsers');
      });
    }

    console.log('userReducer.user:', userReducer.user);
  }, [userReducer.user]);

  const setChatbarState = state => {
    dispatch(chatbarActions.toggleSidebarState(state));
  };

  const setUserSelectedHandler = user => {
    setUserSelected(user);

    setChatbarState(true);
  };

  /*eslint-disable */
  useEffect(() => {
    const onlineUsersArray = [];
    const usersArray = Object.assign([], users);

    onlineUsersArray.push(...onlineUsers);

    usersArray.forEach(user => {
      onlineUsersArray.forEach(onlineUser => {
        if (onlineUser.userId === user.id) {
          onlineUser.username = user.username;
          onlineUser.nickname = `${user.firstname} ${user.lastname}`;
        }
      });
    });

    const filteredArray = onlineUsersArray.filter(function(value, index) {
      return onlineUsers.indexOf(value) === index;
    });

    setOnlineUsersToShow([...new Set(filteredArray)]);
  }, [onlineUsers]);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    if (onlineUsersToShow.length && users.length) {
      const usersArray = Object.assign([], users);
      const onlineUsersToShowArray = Object.assign([], onlineUsersToShow);

      usersArray.forEach(user => {
        const onlineUserFound = onlineUsersToShowArray.find(onlineUser => user.id === onlineUser.userId);
        if (onlineUserFound && user.id === onlineUserFound.userId) {
          console.log('onlineUserFound:', onlineUserFound);
          user.online = true;
        } else {
          user.online = false;
        }
      });
      // usersArray.forEach(user => {
      //   console.log('user', user);

      //   onlineUsersToShowArray.forEach(onlineUser => {
      //     console.log('onlineUser:', onlineUser);
      //     user.online = user.id === onlineUser.userId;
      //     user.socket = onlineUser.socket;
      //   });
      // });

      console.log('forEachusersArray:', usersArray);
      console.log('onlineUsersToShow:', onlineUsersToShow);
      setUsers([...usersArray]);
    }
  }, [onlineUsersToShow]);
  /*eslint-enable */

  const joinRoom = e => {
    e.preventDefault();

    const formData = formSerialize(e.target, { hash: true });

    socket.emit('createRoom', formData.room);
    setRoom(formData.room);
  };

  const sendThumb = () => {
    socket.emit('chat message', {
      username: user.username,
      message: '',
      from: `${user.firstname} ${user.lastname}`,
      thumb: true
    });
  };

  const submitMessageHandler = e => {
    e.preventDefault();

    const messageForm = formSerialize(e.target, { hash: true });

    socket.emit('chat message', {
      username: user.username,
      message: messageForm.message,
      from: `${user.firstname} ${user.lastname}`,
      thumb: false,
      room: room
    });

    e.target.reset();
  };

  return (
    <div
      style={{ position: chatbarState ? 'fixed' : 'initial', zIndex: chatbarState ? '1000' : '1' }}
      className='ChatSidebarWrapper'>
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
              {Object.keys(userSelected).length > 0 ? (
                <>
                  <Avatar src={userSelected.avatar} name={userSelected.firstname} size={50} round='50px' />
                  <h2>
                    {userSelected.firstname} {userSelected.lastname}
                  </h2>
                </>
              ) : (
                <h2>Chat Sidebar</h2>
              )}
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
          <Grid style={{ height: '92%', flexWrap: 'nowrap' }} container>
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
                        colorstatus={!user.online ? 'gray' : '#44b700'}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        onClick={() => setUserSelectedHandler(user)}
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
              <Grid xs={12} item>
                <div className='screen'>
                  <div className='conversation'>
                    {messages.map((messageData, index) => (
                      <div
                        style={{ display: 'flex', alignItems: 'center' }}
                        key={index}
                        className={
                          user.username !== messageData.username ? 'messages--received' : `messages--sent messages`
                        }>
                        <span style={{ marginRight: '1rem' }}>
                          {messageData.from === `${user.firstname} ${user.lastname}` ? 'You' : messageData.from}
                        </span>
                        <div className={messageData.thumb === true ? 'message--thumb thumb anim-wiggle' : ` message`}>
                          <span>{messageData.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='text-bar'>
                    <form onSubmit={event => submitMessageHandler(event)} className='text-bar__field' id='form-message'>
                      <input type='text' name='message' placeholder='Type or thumb up ;)' autoComplete='off' />
                    </form>
                    <div onClick={() => sendThumb()} className='text-bar__thumb'>
                      <div className='thumb'></div>
                    </div>
                  </div>
                </div>
              </Grid>
            ) : null}
          </Grid>
        )}
      </Drawer>
    </div>
  );
};

export default ChatSidebar;
