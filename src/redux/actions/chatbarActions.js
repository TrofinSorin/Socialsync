import * as types from './actionTypes';
import * as api from '../../services/api';

export const toggleSidebarState = state => async dispatch => {
  console.log('state:', state);
  dispatch({
    type: types.TOGGLE_SIDEBAR_STATE,
    payload: state
  });
};
