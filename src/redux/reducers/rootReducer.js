import { combineReducers } from 'redux';
import usersReducer from './usersReducer';
import snackbarReducer from './snackbarReducer';

export default combineReducers({
  usersReducer,
  snackbarReducer
});
