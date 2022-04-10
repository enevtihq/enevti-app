import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { Profile } from 'enevti-app/types/service/enevti/profile';
import { RootState } from 'enevti-app/store/state';

type ProfileView = Profile & { persona: Persona };

type ProfileViewState = ProfileView & { loaded: boolean };

type ProfileViewStore = {
  [key: string]: ProfileViewState;
};

const initialStateItem: ProfileViewState = {
  loaded: false,
  persona: { username: '', photo: '', address: '' },
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
    setProfileView: (profile, action: PayloadAction<ProfileView>) => {
      Object.assign(profile, {
        [action.payload.persona.address]: action.payload,
      });
    },
    setProfileViewLoaded: (
      profile,
      action: PayloadAction<{ address: string; value: boolean }>,
    ) => {
      profile[action.payload.address].loaded = action.payload.value;
    },
    clearProfileByAddress: (profile, action: PayloadAction<string>) => {
      delete profile[action.payload];
    },
    resetProfileByAddress: (profile, action: PayloadAction<string>) => {
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
  clearProfileByAddress,
  resetProfileByAddress,
} = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  [
    (state: RootState) => state.ui.view.profile,
    (state: RootState, address: string) => address,
  ],
  (profile: ProfileViewStore, address: string) =>
    profile.hasOwnProperty(address) ? profile[address] : initialStateItem,
);

export const isProfileUndefined = createSelector(
  [
    (state: RootState) => state.ui.view.profile,
    (state: RootState, address: string) => address,
  ],
  (profile: ProfileViewStore, address: string) =>
    profile.hasOwnProperty(address) ? !profile[address].loaded : true,
);
