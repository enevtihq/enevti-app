import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer, {
  showSnackbar,
  hideSnackbar,
  getSnackBarState,
} from './snackbar';

export { showSnackbar, hideSnackbar, getSnackBarState };

export default combineReducers({
  snackbar: snackbarSliceReducer,
});
