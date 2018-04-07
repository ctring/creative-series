import { SET_CURRENT_SERIES } from './actionTypes';

const setCurrentSeries = (inputSeries) => ({
  type: SET_CURRENT_SERIES,
  inputSeries
});

export { setCurrentSeries };