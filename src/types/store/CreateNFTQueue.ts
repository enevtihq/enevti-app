import { NFTTemplate } from '../nft/NFTTemplate';

export type CreateNFTChoosenTemplate = {
  id: string;
  data: {
    main: NFTTemplate;
    thumbnail: NFTTemplate;
  };
};

type CreateNFTTrait = {
  key: string;
  value: string;
};

export type CreateNFTOneKindState = {
  name: string;
  description: string;
  data: string;
  contentType: string;
  template: string;
  trait: CreateNFTTrait[];
  symbol: string;
  utility: string;
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
    origin: number;
    staker: number;
  };
  price: {
    amount: string;
    currency: string;
  };
  quantity: number;
  mintingExpire: number;
};

export type CreateNFTOneKind = {
  dataUri: string;
  choosenTemplate: CreateNFTChoosenTemplate;
  state: CreateNFTOneKindState;
};

export type CreateNFTPackItemData = {
  data: string;
  trait: CreateNFTTrait[];
};

export type CreateNFTPackItem = {
  content: CreateNFTPackItemData[];
  contentType: string;
  template: string;
  utility: string;
  quantity: number;
  partitionSize: number;
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
    origin: number;
    staker: number;
  };
};

export type CreateNFTPackState = {
  name: string;
  description: string;
  symbol: string;
  price: {
    amount: string;
    currency: string;
  };
  packSize: number;
  mintingExpire: number;
  item: CreateNFTPackItem[];
};

export type CreateNFTPack = {
  dataUri: CreateNFTPackItemData[];
  choosenTemplate: CreateNFTChoosenTemplate;
  state: CreateNFTPackState;
};
