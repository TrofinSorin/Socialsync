import { combineReducers } from 'redux';
import usersReducer from './usersReducer';
import snackbarReducer from './snackbarReducer';
import chatbarReducer from './chatbarReducer';

export default combineReducers({
  usersReducer,
  snackbarReducer,
  chatbarReducer
});
