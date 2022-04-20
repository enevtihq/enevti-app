import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/core/account/persona';
import { Profile } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';

type ProfileView = Profile & { persona: Persona };

type ProfileViewState = ProfileView & { loaded: boolean };

type ProfileViewStore = {
  [key: string]: ProfileViewState;
};

const initialStateItem: ProfileViewState = {
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

const initialState: ProfileViewStore = {};

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    setProfileView: (
      profile,
      action: PayloadAction<{ key: string; value: ProfileView }>,
    ) => {
      Object.assign(profile, {
        [action.payload.key]: action.payload.value,
      });
    },
    setProfileViewLoaded: (
      profile,
      action: PayloadAction<{ key: string; value: boolean }>,
    ) => {
      profile[action.payload.key].loaded = action.payload.value;
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
  setProfileView,
  setProfileViewLoaded,
  resetProfileView,
  clearProfileByKey,
  resetProfileByKey,
} = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  [
    (state: RootState) => state.ui.view.profile,
    (state: RootState, key: string) => key,
  ],
  (profile: ProfileViewStore, key: string) =>
    profile.hasOwnProperty(key) ? profile[key] : initialStateItem,
);

export const isProfileUndefined = createSelector(
  [
    (state: RootState) => state.ui.view.profile,
    (state: RootState, key: string) => key,
  ],
  (profile: ProfileViewStore, key: string) =>
    profile.hasOwnProperty(key) ? !profile[key].loaded : true,
);
