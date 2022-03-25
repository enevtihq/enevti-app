import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { Persona } from '../../../../types/service/enevti/persona';
import { Profile } from '../../../../types/service/enevti/profile';
import { RootState } from '../../../state';

const initialState: Profile & { persona: Persona } = {
  persona: { username: '', photo: '', address: '' },
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  twitter: { username: '', follower: 0 },
  owned: [],
  onsale: [],
  minted: [],
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
      profile.twitter.username = action.payload.twitter.username;
      profile.twitter.follower = action.payload.twitter.follower;
      profile.owned = action.payload.owned.slice();
      profile.onsale = action.payload.onsale.slice();
      profile.minted = action.payload.minted.slice();
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

export const { setProfileView, setPersonaView, resetProfileView } =
  profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.profile,
);

export const isProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.profile,
  (profile: Profile) => shallowEqual(profile, initialState),
);
