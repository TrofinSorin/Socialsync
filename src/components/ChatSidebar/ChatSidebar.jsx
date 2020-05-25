import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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
import InfiniteScrollReverse from 'react-infinite-scroll-reverse';
import Messages from './Messages/Messages';

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
  const [messagesLoader, setMessagesLoader] = useState([false]);
  const [page, setPage] = useState(-1);
  const [hasMore, setHasMore] = useState(true);
  const isFirstRun = useRef(true);
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
    if (userReducer.user && Object.keys(userReducer.user).length > 0) {
      const settedUser = Object.assign({}, userReducer.user);
      settedUser.online = true;
      setUser(settedUser);

      socket.emit('login', { userId: settedUser.id });
      socket.emit('getOnlineUsers');

      socket.on('chat message', data => {
        dispatch(messageActions.addMessageInConversation(data.responseMessage));

        if (settedUser.id !== data.fromUser.id) {
          setMessagesLoader(true);
          socket.emit('getMessages', { fromId: settedUser.id, toId: data.fromUser.id });
          setUserSelected(data.fromUser);

          console.log('userSElected', userSelected);
        }

        setChatbarState(true);

        focusOnLastMessage();
      });

      socket.on('getOnlineUsers', data => {
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

      socket.on('receiveMessages', data => {
        if (data) {
          console.log('receiveMessages data:', data);

          setMessagesLoader(false);
          dispatch(messageActions.getConversationMessages(data.messages)).then(response => {
            console.log('getConversationMessages response:', response);

            if (page.valueOf() === data.totalPages) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }

            focusOnLastMessage();
          });
        }
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

  /*eslint-disable */
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    if (page === 0) {
      return;
    }

    console.log('page:', page);
    console.log('user.id:', user.id);
    console.log('userSelected.id:', userSelected.id);
  }, [page]);
  /*eslint-enable */

  const sidebarUsersSetter = () => {
    if (onlineUsers.length && users.length) {
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

      setSidebarUsers([...new Set(onlineUsersArray)]);
    }
  };

  const setChatbarState = state => {
    dispatch(chatbarActions.toggleSidebarState(state));
  };

  const setUserSelectedHandler = userSelected => {
    console.log('userSelected:', userSelected);
    setUserSelected(userSelected);
    setMessagesLoader(true);
    setChatbarState(true);

    setPage(0);
    socket.emit('getMessages', { fromId: user.id, toId: userSelected.id, page: 0 });
  };

  const focusOnLastMessage = () => {
    var lastMesage = document.getElementsByClassName('itemsContainer')[0];
    lastMesage && lastMesage.lastChild && lastMesage.lastChild.scrollIntoView(false);
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
              <Grid xs={12} item>
                <div className='screen'>
                  <div className='conversation'>
                    {/* <Messages messages={messagesReducer.messages}></Messages> */}
                    {messagesReducer.messages.length > 0 ? (
                      <InfiniteScrollReverse
                        className='itemsContainer'
                        hasMore={hasMore}
                        isLoading={messagesLoader}
                        loadMore={() => setPage(page + 1)}>
                        {messagesReducer.messages.map((messageData, index) => (
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                            key={index}
                            className={
                              user.username !== messageData.username ? 'messages--received' : `messages--sent messages`
                            }>
                            <span style={{ marginRight: '1rem' }}>
                              {messageData.from === `${user.firstname} ${user.lastname}` ? 'You' : messageData.from}
                            </span>
                            <div
                              className={messageData.thumb === true ? 'message--thumb thumb anim-wiggle' : ` message`}>
                              <span>{messageData.text}</span>
                            </div>
                          </div>
                        ))}
                      </InfiniteScrollReverse>
                    ) : (
                      <p>Send a message</p>
                    )}
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
