import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Profile } from '../../../../types/service/enevti/profile';
import { RootState } from '../../../state';

const initialState: Profile & { lastFetch: number } = {
  nftSold: 0,
  treasuryAct: 0,
  serveRate: 0,
  stake: '',
  balance: '',
  social: { twitter: { link: '', stat: 0 } },
  owned: [],
  onsale: [],
  minted: [],
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
      profile.onsale = action.payload.onsale.slice();
      profile.minted = action.payload.minted.slice();
    },
    setLastFetchMyProfileCache: (profile, action: PayloadAction<number>) => {
      profile.lastFetch = action.payload;
    },
    resetMyProfileCache: () => {
      return initialState;
    },
  },
});

export const {
  setMyProfileCache,
  setLastFetchMyProfileCache,
  resetMyProfileCache,
} = profileEntitySlice.actions;
export default profileEntitySlice.reducer;

export const selectMyProfileCache = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.cache.myProfile,
);
