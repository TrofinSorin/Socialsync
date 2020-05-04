import * as types from './actionTypes';
import * as api from '../../services/api';

export const getConversationMessages = messages => async dispatch => {
  dispatch({
    type: types.GET_CONVERSATION_MESSAGES,
    payload: messages ? messages : null
  });
};

export const addMessageInConversation = messageData => async dispatch => {
  dispatch({
    type: types.ADD_MESSAGE_IN_CONVERSATION,
    payload: messageData ? messageData : null
  });
};

export const addMessage = messageData => async dispatch => {
  const addMessageResponse = await api.post('/messages', messageData);

  dispatch({
    type: types.ADD_MESSAGE,
    payload: addMessageResponse ? addMessageResponse.data : null
  });

  return addMessageResponse.data;
};

export const getMessageById = (id, fromId) => async dispatch => {
  const messageResponse = await api.get(`/messages/${id}`);

  dispatch({
    type: types.GET_MESSAGE_BY_ID,
    payload: messageResponse ? messageResponse.data : null
  });

  return messageResponse;
};
