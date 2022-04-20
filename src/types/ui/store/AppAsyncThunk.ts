import { AsyncThunkAction } from '@reduxjs/toolkit';

export type AppAsyncThunk = (...arg: any) => AsyncThunkAction<any, any, any> & {
  abort: () => void;
  unwrap: () => void;
};
