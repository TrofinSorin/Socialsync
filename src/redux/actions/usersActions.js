import * as types from './actionTypes';
import * as api from '../../services/api';

export const login = userData => async dispatch => {
  const loginPayload = await api.post('/authentication', userData);

  dispatch({
    type: types.LOGIN_SUCCESS,
    payload: loginPayload ? loginPayload : null
  });

  return loginPayload;
};

export const createUser = userData => async dispatch => {
  const userCreatedPayload = await api.post('/users', userData);

  dispatch({
    type: types.CREATE_USER,
    payload: userCreatedPayload ? userCreatedPayload.data : null
  });
};

export const forgotPassword = userData => async dispatch => {
  const forgotPasswordResponse = await api.post('/users/password/forgot', userData);

  dispatch({
    type: types.FORGOT_PASSWORD_SUCCESS,
    payload: forgotPasswordResponse ? forgotPasswordResponse.data : null
  });
};

export const setPassword = userData => async dispatch => {
  const setPasswordResponse = await api.post(`/users/reset/${userData.id}/${userData.token}`, userData);

  dispatch({
    type: types.PASSWORD_SET_SUCCESS,
    payload: setPasswordResponse ? setPasswordResponse.data : null
  });
};

export const logout = userData => async dispatch => {
  const logoutResponse = await api.post('/secured/users/logout');

  dispatch({
    type: types.LOGOUT_SUCCESS,
    payload: logoutResponse ? logoutResponse.data : null
  });
};

export const getUser = id => async dispatch => {
  const userResponse = await api.get(`/secured/users/${id}`);

  dispatch({
    type: types.GET_USER_SUCCESS,
    payload: userResponse ? userResponse.data : null
  });

  return userResponse;
};

export const getUsers = () => async dispatch => {
  const userResponse = await api.get(`/users`);
  console.log('userResponse:', userResponse);

  dispatch({
    type: types.GET_USERS_SUCCESS,
    payload: userResponse ? userResponse.data : null
  });

  return userResponse;
};

export const getUserTokenValidation = (id, token) => async dispatch => {
  const userResponse = await api.get(`/users/password/${id}/${token}`);
  console.log('userResponse:', userResponse);

  dispatch({
    type: types.GET_USER_VALIDATION_TOKEN,
    payload: userResponse ? userResponse.data : null
  });

  return userResponse;
};
