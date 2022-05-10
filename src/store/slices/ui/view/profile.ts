import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ProfileView } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';

type ProfileViewState = ProfileView & { reqStatus: number; loaded: boolean };

type ProfileViewStore = {
  [key: string]: ProfileViewState;
};

const initialStateItem: ProfileViewState = {
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
};

const initialState: ProfileViewStore = {};

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    initProfileView: (profile, action: PayloadAction<string>) => {
      Object.assign(profile, { [action.payload]: {} });
    },
    setProfileView: (profile, action: PayloadAction<{ key: string; value: Record<string, any> }>) => {
      Object.assign(profile, {
        [action.payload.key]: action.payload.value,
      });
    },
    setProfileViewLoaded: (profile, action: PayloadAction<{ key: string; value: boolean }>) => {
      profile[action.payload.key].loaded = action.payload.value;
    },
    setProfileViewReqStatus: (profile, action: PayloadAction<{ key: string; value: number }>) => {
      profile[action.payload.key].reqStatus = action.payload.value;
    },
    clearProfileByKey: (profile, action: PayloadAction<string>) => {
      delete profile[action.payload];
    },
    resetProfileByKey: (profile, action: PayloadAction<string>) => {
      Object.assign(profile[action.payload], initialStateItem);
    },
    resetProfileView: () => {
      return initialState;
    },
  },
});

export const {
  initProfileView,
  setProfileView,
  setProfileViewLoaded,
  setProfileViewReqStatus,
  resetProfileView,
  clearProfileByKey,
  resetProfileByKey,
} = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? profile[key] : initialStateItem),
);

export const isProfileUndefined = createSelector(
  [(state: RootState) => state.ui.view.profile, (state: RootState, key: string) => key],
  (profile: ProfileViewStore, key: string) => (profile.hasOwnProperty(key) ? !profile[key].loaded : true),
);
