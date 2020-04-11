import * as types from './actionTypes';
import * as api from '../../services/api';

export const loadRestaurants = () => async dispatch => {
  const restaurants = await api.get();

  dispatch({
    type: types.LOAD_RESTAURANT_SUCCESS,
    payload: restaurants.data
  });
};
