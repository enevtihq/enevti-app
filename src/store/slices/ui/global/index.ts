import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer from './snackbar';

export default combineReducers({
  snackbar: snackbarSliceReducer,
});
