import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { Profile } from 'enevti-app/types/service/enevti/profile';
import { RootState } from 'enevti-app/store/state';

type MyProfileView = Profile & { persona: Persona };

type MyProfileViewState = MyProfileView & { loaded: boolean };

const initialState: MyProfileViewState = {
  loaded: false,
  persona: { username: '', photo: '', base32: '', address: '' },
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  social: { twitter: { link: '', stat: 0 } },
  owned: [],
  onsale: [],
  collection: [],
};

const myProfileViewSlice = createSlice({
  name: 'myProfileView',
  initialState,
  reducers: {
    setMyProfileView: (profile, action: PayloadAction<MyProfileView>) => {
      Object.assign(profile, action.payload);
    },
    setMyProfileViewLoaded: (profile, action: PayloadAction<boolean>) => {
      profile.loaded = action.payload;
    },
    resetMyProfileView: () => {
      return initialState;
    },
  },
});

export const { setMyProfileView, setMyProfileViewLoaded, resetMyProfileView } =
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
