import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from '../../../../types/service/enevti/profile';
import { RootState } from '../../../state';

const initialState: Profile = {
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
  },
});

export const { setProfileView } = profileViewSlice.actions;
export default profileViewSlice.reducer;

export const selectProfileView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.profile,
);
