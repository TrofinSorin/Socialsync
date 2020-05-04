import * as types from '../actions/actionTypes';

const initialState = {
  messages: []
};

function messagesReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.GET_CONVERSATION_MESSAGES:
      const newConversationArray = [];

      return {
        ...state,
        messages: [...newConversationArray, ...payload].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      };

    case types.GET_MESSAGE_BY_ID:
      return {
        ...state,
        messages: [...state.messages, payload]
      };

    case types.ADD_MESSAGE_IN_CONVERSATION:
      return {
        ...state,
        messages: [...state.messages, payload]
      };

    case types.ADD_MESSAGE:
      return {
        ...state
      };

    default:
      return state;
  }
}

export default messagesReducer;
