import { NFTPrice } from 'enevti-app/types/nft/NFTPrice';

export type CreateNFTOneKindTransaction = {
  name: string;
  description: string;
  symbol: string;
  cover: string;
  coverMime: string;
  coverExtension: string;
  coverSize: number;
  data: string;
  dataMime: string;
  dataExtension: string;
  dataSize: number;
  utility: string;
  content: string;
  contentMime: string;
  contentExtension: string;
  contentSize: number;
  recurring: string;
  time: {
    day: number;
    date: number;
    month: number;
    year: number;
  };
  from: {
    hour: number;
    minute: number;
  };
  until: number;
  redeemLimit: number;
  royalty: {
    creator: number;
    staker: number;
  };
  price: {
    amount: bigint;
    currency: string;
  };
  quantity: number;
  mintingExpire: number;
};

export type MintCollectionTransaction = {
  id: string;
  quantity: number;
};

export type AddStakeTransaction = {
  address: string;
  amount: NFTPrice;
};
