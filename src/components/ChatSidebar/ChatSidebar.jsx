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
import * as messageActions from '@redux/actions/messageActions';
import Loader from '../../_shared/Loader/Loader';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import useSocket from 'use-socket.io-client';
import formSerialize from 'form-serialize';
import './ChatSidebar.scss';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Messages from './Messages/Messages';
import { toast } from 'react-toastify';

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
  },
  clearSelectedUser: {
    cursor: 'pointer',
    fontSize: '2.5rem'
  }
}));

const ChatSidebar = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const chatbarReducer = useSelector(state => state.chatbarReducer);
  const userReducer = useSelector(state => state.usersReducer);
  const messagesReducer = useSelector(state => state.messagesReducer);
  const chatbarState = chatbarReducer.opened;
  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(false);
  const [user, setUser] = useState({});
  const [userSelected, setUserSelected] = useState({});
  const [socket] = useSocket('http://localhost:8001', {
    autoConnect: false
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sidebarUsers, setSidebarUsers] = useState([]);

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

  /*eslint-disable */
  useEffect(() => {
    console.log('chatbarState:', chatbarState);
    if (chatbarState) {
      socket.emit('getOnlineUsers');
      dispatch(messageActions.clearMessages());
    }
  }, [chatbarState]);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    if (userReducer.user && Object.keys(userReducer.user).length > 0) {
      const settedUser = Object.assign({}, userReducer.user);
      settedUser.online = true;
      setUser(settedUser);

      socket.emit('login', { userId: settedUser.id });
      socket.emit('getOnlineUsers');

      socket.on('chat message', data => {
        dispatch(messageActions.addMessageInConversation(data.responseMessage));

        if (settedUser.id !== data.fromUser.id) {
          // socket.emit('getMessages', { fromId: settedUser.id, toId: data.fromUser.id });
          // setUserSelected(data.fromUser);
          displayMsg(data.responseMessage, data.fromUser, setUserSelected);
          console.log('userSElected', userSelected);
        }

        // setChatbarState(true);

        focusOnLastMessage();
      });

      socket.on('getOnlineUsers', data => {
        console.log('data:', data);
        setOnlineUsers([]);

        const onlineUsers = [];

        Object.keys(data).forEach(item => {
          onlineUsers.push({
            userId: item,
            socket: data[item]
          });
        });

        setOnlineUsers(onlineUsers);
      });

      socket.on('disconnect', data => {
        socket.emit('getOnlineUsers');
      });
    }
  }, [userReducer.user]);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    sidebarUsersSetter();
  }, [onlineUsers]);
  /*eslint-enable */

  const Msg = ({ message, closeToast, fromUser, setUserSelected }) => {
    const openConversation = (event, user) => {
      event.stopPropagation();
      setUserSelected(user);
      closeToast();
    };

    return (
      <div onClick={event => openConversation(event, fromUser)} style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ flexBasis: 'auto' }}>{message.from}:</h2>
        <h3 style={{ marginLeft: '0.5rem', marginBottom: '.2rem', wordBreak: 'break-all' }}>{message.text}</h3>
      </div>
    );
  };

  const sidebarUsersSetter = () => {
    if (onlineUsers.length && users && users.length) {
      const usersArray = Object.assign([], users);
      const onlineUsersToShowArray = Object.assign([], onlineUsers);

      usersArray.forEach(userItem => {
        const onlineUserFound = onlineUsersToShowArray.find(onlineUser => +userItem.id === +onlineUser.userId);

        if (onlineUserFound && +userItem.id === +onlineUserFound.userId) {
          userItem.online = true;
        } else {
          userItem.online = false;
        }
      });

      const onlineUsersArray = usersArray.filter(onlineUser => onlineUser.id !== user.id);

      console.log('onlineUsersArray:', onlineUsersArray);
      setSidebarUsers([...new Set(onlineUsersArray)]);
    }
  };

  const displayMsg = (message, fromUser, setUserSelected) => {
    console.log('displayMsg:');
    toast(<Msg message={message} fromUser={fromUser} setUserSelected={setUserSelectedHandler} />, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };

  const setChatbarState = state => {
    dispatch(chatbarActions.toggleSidebarState(state));
  };

  const setUserSelectedHandler = newUserSelected => {
    if (userSelected.id === newUserSelected.id) {
      return;
    }

    setUserSelected(newUserSelected);
    setChatbarState(true);
    dispatch(messageActions.clearMessages());
  };

  const focusOnLastMessage = () => {
    var lastMesage = document.getElementsByClassName('itemsContainer')[0];

    lastMesage && lastMesage.lastChild && lastMesage.lastChild.scrollIntoView(false);
  };

  const sendThumb = () => {
    const payload = {
      username: user.username,
      message: '',
      from: `${user.firstname} ${user.lastname}`,
      toUserId: userSelected.id,
      fromUserId: user.id,
      thumb: true,
      status: ['unread']
    };

    dispatch(messageActions.addMessage(payload)).then(response => {
      payload.toUser = userSelected;
      payload.fromUser = user;
      payload.responseMessage = response;

      socket.emit('chat message', payload);
    });
  };

  const submitMessageHandler = e => {
    e.preventDefault();

    const messageForm = formSerialize(e.target, { hash: true });
    const payload = {
      username: user.username,
      text: messageForm.message,
      from: `${user.firstname} ${user.lastname}`,
      thumb: false,
      toUserId: userSelected.id,
      fromUserId: user.id,
      status: ['unread']
    };

    dispatch(messageActions.addMessage(payload)).then(response => {
      payload.toUser = userSelected;
      payload.fromUser = user;
      payload.responseMessage = response;

      socket.emit('chat message', payload);
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
                  <HighlightOffIcon
                    onClick={() => setUserSelectedHandler({})}
                    className={classes.clearSelectedUser}></HighlightOffIcon>
                </>
              ) : (
                <h2 style={{ marginLeft: '1rem' }}>Select a user to have a conversation</h2>
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
            <Grid style={{ height: '100%' }} item xs={chatbarState ? 2 : 12}>
              <List style={{ backgroundColor: '#F7F7F7', height: '100%', padding: '0' }}>
                {sidebarUsers
                  .sort((a, b) => b.online - a.online)
                  .map((user, index) => (
                    <ListItem className={classes.listItem} key={user.id}>
                      <Tooltip
                        title={
                          <span
                            style={{
                              fontSize: '1.3rem',
                              padding: '1rem'
                            }}>{`${user.firstname} ${user.lastname}`}</span>
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
              <Grid xs={10} item>
                <div className='screen'>
                  <div className='conversation'>
                    <Messages
                      setUserSelected={setUserSelected}
                      chatbarState={chatbarState}
                      focusOnLastMessage={focusOnLastMessage}
                      messages={messagesReducer.messages}
                      user={userReducer.user}
                      userSelected={userSelected}
                      socket={socket}></Messages>
                  </div>
                  {Object.keys(userSelected).length > 0 ? (
                    <div className='text-bar'>
                      <form
                        onSubmit={event => submitMessageHandler(event)}
                        className='text-bar__field'
                        id='form-message'>
                        <input type='text' name='message' placeholder='Type or thumb up ;)' autoComplete='off' />
                      </form>
                      <div onClick={() => sendThumb()} className='text-bar__thumb'>
                        <div className='thumb'></div>
                      </div>
                    </div>
                  ) : null}
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
