import { combineReducers } from '@reduxjs/toolkit';
import snackbarSliceReducer from './snackbar';
import modalLoaderReducer from './modalLoader';
import statusBarReducer from './statusbar';
import keyboardReducer from './keyboard';

export default combineReducers({
  snackbar: snackbarSliceReducer,
  modalLoader: modalLoaderReducer,
  statusbar: statusBarReducer,
  keyboard: keyboardReducer,
});
