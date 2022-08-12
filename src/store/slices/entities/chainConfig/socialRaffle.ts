import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { SocialRaffleGenesisConfig } from 'enevti-app/types/core/chain/config/SocialRaffleGenesisConfig';

const initialState: SocialRaffleGenesisConfig['socialRaffle'] = {
  blockInterval: 0,
  maxPrice: '-1',
  maxRaffledPerCollection: -1,
  maxRaffledPerProfile: -1,
  rewardsCutPercentage: 0,
};

const socialRaffleChainConfigEntitySlice = createSlice({
  name: 'socialRaffleConfig',
  initialState,
  reducers: {
    setSocialRaffleChainConfig: (
      socialRaffleConfig,
      action: PayloadAction<SocialRaffleGenesisConfig['socialRaffle']>,
    ) => {
      Object.assign(socialRaffleConfig, action.payload);
    },
  },
});

export const { setSocialRaffleChainConfig } = socialRaffleChainConfigEntitySlice.actions;
export default socialRaffleChainConfigEntitySlice.reducer;

export const selectSocialRaffleConfig = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.entities.chainConfig.socialRaffle,
);
