import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import reducer from './reducer';
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AsyncThunkAPI = { dispatch: AppDispatch; state: RootState };
