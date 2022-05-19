import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';

type ManagedUI = 'profile' | 'collection' | 'nftDetails' | 'stakePool';

type UIManagerItem = {
  [key: string]: number;
};

type UIManagerStore = Record<ManagedUI, UIManagerItem>;

const initialState: UIManagerStore = {
  profile: {},
  collection: {},
  nftDetails: {},
  stakePool: {},
};

const uiManagerSlice = createSlice({
  name: 'uiManager',
  initialState,
  reducers: {
    addProfileUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.profile[action.payload] === undefined
        ? (uiManager.profile[action.payload] = 0)
        : uiManager.profile[action.payload]++;
    },
    subtractProfileUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.profile[action.payload] === 0
        ? delete uiManager.profile[action.payload]
        : uiManager.profile[action.payload]--;
    },
    addCollectionUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.collection[action.payload] === undefined
        ? (uiManager.collection[action.payload] = 0)
        : uiManager.collection[action.payload]++;
    },
    subtractCollectionUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.collection[action.payload] === 0
        ? delete uiManager.collection[action.payload]
        : uiManager.collection[action.payload]--;
    },
    addNFTDetailsUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.nftDetails[action.payload] === undefined
        ? (uiManager.nftDetails[action.payload] = 0)
        : uiManager.nftDetails[action.payload]++;
    },
    subtractNFTDetailsUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.nftDetails[action.payload] === 0
        ? delete uiManager.nftDetails[action.payload]
        : uiManager.nftDetails[action.payload]--;
    },
    addStakePoolUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.stakePool[action.payload] === undefined
        ? (uiManager.stakePool[action.payload] = 0)
        : uiManager.stakePool[action.payload]++;
    },
    subtractStakePoolUIManager: (uiManager, action: PayloadAction<string>) => {
      uiManager.stakePool[action.payload] === 0
        ? delete uiManager.stakePool[action.payload]
        : uiManager.stakePool[action.payload]--;
    },
    resetUIManager: () => {
      return initialState;
    },
  },
});

export const {
  addProfileUIManager,
  subtractProfileUIManager,
  addCollectionUIManager,
  subtractCollectionUIManager,
  addNFTDetailsUIManager,
  subtractNFTDetailsUIManager,
  addStakePoolUIManager,
  subtractStakePoolUIManager,
  resetUIManager,
} = uiManagerSlice.actions;
export default uiManagerSlice.reducer;

export const selectUIManager = createSelector(
  (state: RootState) => state.ui.view.uiManager,
  (uiManager: UIManagerStore) => uiManager,
);
