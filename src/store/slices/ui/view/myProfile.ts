import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { Profile } from 'enevti-app/types/service/enevti/profile';
import { RootState } from 'enevti-app/store/state';

type MyProfileViewState = Profile & { loaded: boolean; persona: Persona };

const initialState: MyProfileViewState = {
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
      profile.social.twitter.link = action.payload.social.twitter.link;
      profile.social.twitter.stat = action.payload.social.twitter.stat;
      profile.owned = action.payload.owned.slice();
      profile.onsale = action.payload.onsale.slice();
      profile.collection = action.payload.collection.slice();
    },
    setMyProfileViewLoaded: (profile, action: PayloadAction<boolean>) => {
      profile.loaded = action.payload;
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

export const {
  setMyProfileView,
  setMyProfileViewLoaded,
  setMyPersonaView,
  resetMyProfileView,
} = myProfileViewSlice.actions;
export default myProfileViewSlice.reducer;

export const selectMyProfileView = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.ui.view.myProfile,
);

export const isMyProfileUndefined = createSelector(
  (state: RootState) => state.ui.view.myProfile,
  (profile: MyProfileViewState) => !profile.loaded,
);
