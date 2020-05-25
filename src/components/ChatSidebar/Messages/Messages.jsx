import React from 'react';
import PropTypes from 'prop-types';

const Messages = props => {
  const { messages } = props;

  return (
    <div className='MessagesWrapper'>
      <h1>Messages</h1>
    </div>
  );
};

Messages.propTypes = {
  messages: PropTypes.array
};

Messages.defaultProps = {
  // bla: 'test',
};

export default Messages;
