import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer, { setSnackbarGlobalState } from './snackbar';

export { setSnackbarGlobalState };

export default combineReducers({
  snackbar: snackbarSliceReducer,
});
