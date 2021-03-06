import * as types from '../actions/actionTypes';
import Auth from '../../services/Auth';

const initialState = {
  user: {},
  usersToSelectFrom: []
};

function usersReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.LOGIN_SUCCESS:
      Auth.authenticate(payload.data.userMessage);

      return {
        ...state,
        user: payload.data.userMessage.loginUser
      };

    case types.CREATE_USER:
      return {
        ...state,
        ...payload
      };

    case types.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        ...payload
      };

    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        ...payload
      };

    case types.GET_USER_SUCCESS:
      return {
        ...state,
        user: payload.data
      };

    case types.GET_USERS_TO_SELECT_FROM_SUCCESS:
      return {
        ...state,
        usersToSelectFrom: payload.data
      };

    default:
      return state;
  }
}

export default usersReducer;
