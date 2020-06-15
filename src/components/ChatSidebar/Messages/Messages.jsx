import React, { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import InfiniteScrollReverse from 'react-infinite-scroll-reverse';
import * as messageActions from '@redux/actions/messageActions';
import { useDispatch } from 'react-redux';
import Loader from '../../../_shared/Loader/Loader';
import AutocompleteInput from '../../../_shared/AutocompleteInput/AutocompleteInput';

const Messages = props => {
  const { messages, user, socket, focusOnLastMessage, userSelected, setUserSelected } = props;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [messagesLoader, setMessagesLoader] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const dispatch = useDispatch();
  const scrollContainer = useRef(null);
  const [loadScrollMessages, setLoadScrollMessages] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (scrollContainer.current && scrollContainer.current.infinteRef.current) {
      scrollContainer.current.infinteRef.current.addEventListener('scroll', scrollHandler);

      return () =>
        scrollContainer.current &&
        scrollContainer.current.infinteRef.current.removeEventListener('scroll', scrollHandler);
    }
  }, [messages]);

  const pageSetter = () => {
    if (loadScrollMessages) {
      setPage(new Number(page + 1));
    }
  };

  const scrollHandler = () => {
    const itemsContainer = document.getElementsByClassName('itemsContainer')[0];

    if (itemsContainer && itemsContainer.scrollTop < 100) {
      setLoadScrollMessages(true);
    } else {
      setLoadScrollMessages(false);
    }
  };

  /*eslint-disable */
  useEffect(() => {
    console.log('useEffect page:', page.valueOf());
    console.log('user.id:', user.id);
    console.log('userSelected.id:', userSelected.id);
    console.log('page.valueOf():', page.valueOf());
    console.log('data.totalPages:', totalPages);

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (page.valueOf() === totalPages) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    console.log('userSelected:', userSelected);
    if (Object.keys(userSelected).length > 0) {
      socket.emit('getMessages', { fromId: user.id, toId: userSelected.id, page });
    }
  }, [page]);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    socket.on('receiveMessages', data => {
      if (data) {
        console.log('receiveMessages data:', data);

        setMessagesLoader(false);

        dispatch(messageActions.getConversationMessages(data.messages)).then(response => {
          setTotalPages(data.totalPages);

          if (data.page === 0) {
            focusOnLastMessage();
          }
        });
      }
    });

    return () => socket.removeAllListeners('receiveMessages');
  }, [user]);
  /*eslint-enable */

  /*eslint-disable */
  useEffect(() => {
    if (Object.keys(userSelected).length > 0) {
      setMessagesLoader(true);
      setPage(new Number(0));
      setLoadScrollMessages(false);
    }
  }, [userSelected]);
  /*eslint-enable */

  return (
    <div style={{ height: '100%' }} className='MessagesWrapper'>
      {messagesLoader ? (
        <Loader></Loader>
      ) : messages.length > 0 ? (
        <InfiniteScrollReverse
          className='itemsContainer'
          ref={scrollContainer}
          hasMore={hasMore}
          isLoading={messagesLoader}
          loadMore={() => pageSetter()}>
          {messages.map((messageData, index) => (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              key={index}
              className={user.username !== messageData.username ? 'messages--received' : `messages--sent messages`}>
              <span style={{ marginRight: '1rem' }}>
                {messageData.from === `${user.firstname} ${user.lastname}` ? '' : messageData.from}
              </span>
              <span className={messageData.thumb === true ? 'message--thumb thumb anim-wiggle' : ` message`}>
                {messageData.text}
              </span>
            </div>
          ))}
        </InfiniteScrollReverse>
      ) : (
        <div style={{ width: '90%', margin: '1rem' }}>
          <AutocompleteInput setUserSelected={setUserSelected}></AutocompleteInput>
        </div>
      )}
    </div>
  );
};

Messages.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  socket: PropTypes.object,
  focusOnLastMessage: PropTypes.func,
  userSelected: PropTypes.object
};

export default memo(Messages);
