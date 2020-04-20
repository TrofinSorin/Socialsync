import * as types from '../actions/actionTypes';

const initialState = {
  opened: false
};

function chatbarReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.TOGGLE_SIDEBAR_STATE:
      return {
        ...state,
        opened: payload
      };

    default:
      return state;
  }
}

export default chatbarReducer;
