import * as types from '../actions/actionTypes';

const initialState = {
  messages: []
};

function messagesReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.GET_MESSAGE_BY_ID:
      return {
        ...state,
        messages: [...state.messages, payload]
      };

    case types.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload]
      };

    default:
      return state;
  }
}

export default messagesReducer;
