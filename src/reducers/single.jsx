import { SET_CURRENT_SERIES } from '../actions/actionTypes';

export default (
  state = {
    currentSeries: []
  },
  action) => {
  switch (action.type) {
    case SET_CURRENT_SERIES:
      return Object.assign({}, state, {
        currentSeries: action.inputSeries
      });
    default:
      return state;
  }
}