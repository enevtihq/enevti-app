import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from '../../../types/service/enevti/profile';
import { RootState } from '../../state';

const initialState: Profile & { lastFetch: number } = {
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  twitter: { username: '', follower: 0 },
  owned: [],
  onsale: [],
  minted: [],
  lastFetch: 0,
};

const profileEntitySlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (profile, action: PayloadAction<Profile>) => {
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
    setLastFetchProfile: (profile, action: PayloadAction<number>) => {
      profile.lastFetch = action.payload;
    },
  },
});

export const { setProfile, setLastFetchProfile } = profileEntitySlice.actions;
export default profileEntitySlice.reducer;

export const selectProfile = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.profile,
);
