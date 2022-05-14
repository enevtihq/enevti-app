import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from 'enevti-app/types/core/account/profile';
import { RootState } from 'enevti-app/store/state';

const initialState: Profile & { lastFetch: number } = {
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
  lastFetch: 0,
};

const profileEntitySlice = createSlice({
  name: 'myProfileCache',
  initialState,
  reducers: {
    setMyProfileCache: (profile, action: PayloadAction<Profile>) => {
      profile.nftSold = action.payload.nftSold;
      profile.treasuryAct = action.payload.treasuryAct;
      profile.serveRate = action.payload.serveRate;
      profile.stake = action.payload.stake;
      profile.balance = action.payload.balance;
      profile.social.twitter.link = action.payload.social.twitter.link;
      profile.social.twitter.stat = action.payload.social.twitter.stat;
      profile.owned = action.payload.owned.slice();
      profile.onSale = action.payload.onSale.slice();
      profile.collection = action.payload.collection.slice();
    },
    setLastFetchMyProfileCache: (profile, action: PayloadAction<number>) => {
      profile.lastFetch = action.payload;
    },
    resetMyProfileCache: () => {
      return initialState;
    },
  },
});

export const { setMyProfileCache, setLastFetchMyProfileCache, resetMyProfileCache } = profileEntitySlice.actions;
export default profileEntitySlice.reducer;

export const selectMyProfileCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myProfile,
);
