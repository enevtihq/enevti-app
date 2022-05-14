import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';

type MyProfileViewState = ProfileView & { reqStatus: number; loaded: boolean };

const initialState: MyProfileViewState = {
  loaded: false,
  reqStatus: 0,
  persona: { username: '', photo: '', base32: '', address: '' },
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  social: { twitter: { link: '', stat: 0 } },
  owned: [],
  onSale: [],
  collection: [],
  pending: 0,
};

const myProfileViewSlice = createSlice({
  name: 'myProfileView',
  initialState,
  reducers: {
    setMyProfileView: (profile, action: PayloadAction<Record<string, any>>) => {
      Object.assign(profile, action.payload);
    },
    setMyProfileViewLoaded: (profile, action: PayloadAction<boolean>) => {
      profile.loaded = action.payload;
    },
    setMyProfileViewReqStatus: (profile, action: PayloadAction<number>) => {
      profile.reqStatus = action.payload;
    },
    resetMyProfileView: () => {
      return initialState;
    },
  },
});

export const { setMyProfileView, setMyProfileViewLoaded, setMyProfileViewReqStatus, resetMyProfileView } =
  myProfileViewSlice.actions;
export default myProfileViewSlice.reducer;

export const selectMyProfileView = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => profile,
);

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => !profile.loaded,
);
