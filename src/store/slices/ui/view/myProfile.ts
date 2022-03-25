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

const myProfileViewSlice = createSlice({
  name: 'myProfileView',
  initialState,
  reducers: {
    setMyProfileView: (profile, action: PayloadAction<Profile>) => {
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
    setMyPersonaView: (profile, action: PayloadAction<Persona>) => {
      profile.persona.username = action.payload.username;
      profile.persona.photo = action.payload.photo;
      profile.persona.address = action.payload.address;
    },
    resetMyProfileView: () => {
      return initialState;
    },
  },
});

export const { setMyProfileView, setMyPersonaView, resetMyProfileView } =
  myProfileViewSlice.actions;
export default myProfileViewSlice.reducer;

export const selectMyProfileView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.myProfile,
);

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: Profile) => shallowEqual(profile, initialState),
);
