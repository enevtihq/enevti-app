import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { Profile } from 'enevti-app/types/service/enevti/profile';
import { RootState } from 'enevti-app/store/state';

type ProfileViewState = Profile & { loaded: boolean; persona: Persona };

const initialState: ProfileViewState = {
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

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    setProfileView: (profile, action: PayloadAction<Profile>) => {
      profile.nftSold = action.payload.nftSold;
      profile.treasuryAct = action.payload.treasuryAct;
      profile.serveRate = action.payload.serveRate;
      profile.stake = action.payload.stake;
      profile.balance = action.payload.balance;
      profile.social.twitter.link = action.payload.social.twitter.link;
      profile.social.twitter.stat = action.payload.social.twitter.stat;
      profile.owned = action.payload.owned.slice();
      profile.onsale = action.payload.onsale.slice();
      profile.collection = action.payload.collection.slice();
    },
    setProfileViewLoaded: (profile, action: PayloadAction<boolean>) => {
      profile.loaded = action.payload;
    },
    setPersonaView: (profile, action: PayloadAction<Persona>) => {
      profile.persona.username = action.payload.username;
      profile.persona.photo = action.payload.photo;
      profile.persona.address = action.payload.address;
    },
    resetProfileView: () => {
      return initialState;
    },
  },
});

export const {
  setProfileView,
  setProfileViewLoaded,
  setPersonaView,
  resetProfileView,
} = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.profile,
);

export const isProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.profile,
  (profile: ProfileViewState) => !profile.loaded,
);
