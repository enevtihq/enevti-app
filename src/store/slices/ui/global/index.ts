import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer, { showSnackbar, hideSnackbar } from './snackbar';

export { showSnackbar, hideSnackbar };

export default combineReducers({
  snackbar: snackbarSliceReducer,
});
