import * as types from './actionTypes';
import * as api from '../../services/api';

export const addMessage = messageData => async dispatch => {
  const addMessageResponse = await api.post('/messages', messageData);

  dispatch({
    type: types.ADD_MESSAGE,
    payload: addMessageResponse ? addMessageResponse.data : null
  });
};

export const getMessageById = (id, fromId) => async dispatch => {
  const messageResponse = await api.get(`/messages/${id}`);

  dispatch({
    type: types.GET_MESSAGE_BY_ID,
    payload: messageResponse ? messageResponse.data : null
  });

  return messageResponse;
};
