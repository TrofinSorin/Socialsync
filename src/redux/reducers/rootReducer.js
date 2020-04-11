import { combineReducers } from 'redux';
import restaurantReducer from './restaurantReducer';
import usersReducer from './usersReducer';
import snackbarReducer from './snackbarReducer';

export default combineReducers({
  restaurantReducer,
  usersReducer,
  snackbarReducer
});
