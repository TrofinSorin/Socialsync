import * as types from '../actions/actionTypes';

const initialState = {
  restaurants: []
};

function restaurantReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case types.LOAD_RESTAURANT_SUCCESS:
      return {
        restaurants: payload
      };

    default:
      return state;
  }
}

export default restaurantReducer;
