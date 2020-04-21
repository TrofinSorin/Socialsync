import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import './ChatRoom.scss';
import * as usersActions from '@redux/actions/usersActions';
import Loader from '../../_shared/Loader/Loader';
import formSerialize from 'form-serialize';
import { useDispatch } from 'react-redux';
import Auth from '@services/Auth';
import useSocket from 'use-socket.io-client';
import { useImmer } from 'use-immer';
import Avatar from 'react-avatar';

const ChatRoom = props => {
  const dispatch = useDispatch();
  const [socket] = useSocket('http://localhost:8001', {
    autoConnect: false
    //any other options
  });

  const [users, setUsers] = useState([]);
  const [userLoader, setUserLoader] = useState(false);
  const [messages, setMessages] = useImmer([]);
  const [user, setUser] = useState();
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useImmer([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUsersToShow, setOnlineUsersToShow] = useState([]);

  const sendThumb = () => {
    socket.emit('chat message', {
      username: user.username,
      message: '',
      from: `${user.firstname} ${user.lastname}`,
      thumb: true
    });
  };

  const joinRoom = e => {
    e.preventDefault();

    const formData = formSerialize(e.target, { hash: true });

    socket.emit('createRoom', formData.room);
    setRoom(formData.room);
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', room);
    setRoom(null);
  };

  const joinUserRoom = user => {
    console.log('user:', user);
    socket.emit('createRoom', user.socket);
    setRoom(user.socket);
  };

  /*eslint-disable */
  useEffect(() => {
    socket.emit('getRooms');

    socket.on('getRooms', data => {
      console.log('data:', data);

      setRooms(draft => {
        draft.push({ data });
      });
    });

    socket.on('disconnect', data => {
      socket.emit('getOnlineUsers');
    });
  }, []);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    setUserLoader(true);

    const getUser = Auth.getUser();

    dispatch(usersActions.getUsers())
      .then(result => {
        setUsers(result.data.data);
        setUserLoader(false);
      })
      .catch(err => {});

    if (getUser.loginUser) {
      dispatch(usersActions.getUser(getUser.loginUser.id)).then(result => {
        Auth.update(result.data);
        setUser(result.data.data);

        socket.emit('login', { userId: result.data.data.id });
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
      });
    }
  }, []);
  /*eslint-enable */

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
    <div className='ChatRoomWrapper'>
      <Grid container className='home-header top-bar'>
        {!room ? (
          <Grid item xs={6} className='layout-row justify-content-center'>
            <form onSubmit={event => joinRoom(event)} className='text-bar__field' id='form-message'>
              <h2>Join A Room</h2>
              <input type='text' name='room' placeholder='Join a room' autoComplete='off' />
            </form>
          </Grid>
        ) : null}
      </Grid>

      <Grid container className='home-header top-bar'>
        <Grid item xs={12} className='layout-row justify-content-around'>
          {userLoader ? (
            <Loader></Loader>
          ) : (
            <div className='user-list'>
              {user ? (
                <>
                  <h2>
                    Logged as {user.firstname} {user.lastname}
                  </h2>
                  <Avatar
                    src={user.avatar ? user.avatar : ''}
                    name={user.firstname ? user.firstname : null}
                    size={50}
                    round='50px'
                  />
                </>
              ) : null}
              <h2>Users List</h2>
              {onlineUsersToShow.map(item => (
                <p key={item.userId} onClick={() => joinUserRoom(item)} className='cursor-pointer'>
                  {item.nickname}
                </p>
              ))}
            </div>
          )}

          {room ? (
            <div>
              <h2>Room: {room}</h2>
              <span className='cursor-pointer' onClick={() => leaveRoom()}>
                Leave Room
              </span>
              <div className='screen'>
                <div className='header'>
                  {user ? (
                    <>
                      <Avatar src={user.avatar} name={user.firstname} size={50} round='50px' />
                      <p>{user.firstname + user.lastname}</p>
                    </>
                  ) : null}
                </div>
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
            </div>
          ) : (
            <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
              <p>Enter a room</p>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatRoom;
