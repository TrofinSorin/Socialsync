import * as types from '../actions/actionTypes';

const initialState = {
  message: ''
};

function snackbarReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.SET_SNACKBAR_SUCCESS:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
}

export default snackbarReducer;
