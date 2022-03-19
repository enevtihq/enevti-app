import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer from './snackbar';
import modalLoaderReducer from './modalLoader';

export default combineReducers({
  snackbar: snackbarSliceReducer,
  modalLoader: modalLoaderReducer,
});
