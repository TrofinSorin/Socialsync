import * as types from './actionTypes';

export const setSnackbarMessage = (message, type) => dispatch => {
  if (!message && !type) {
    return;
  }

  const payload = {
    message: message,
    type: type
  };

  dispatch({
    type: types.SET_SNACKBAR_SUCCESS,
    payload: payload ? payload : null
  });
};
