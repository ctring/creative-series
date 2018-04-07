import { SET_INPUT_SERIES } from '../actions/actionTypes';

export default (
  state = {
      inputSeries: []
  },
  action) => {
  switch (action.type) {
    case SET_INPUT_SERIES:
      return Object.assign({}, state, { inputSeries: action.series });
    default:
      return state;
  }
}