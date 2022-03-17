import { NFTTemplateAsset } from '../nft/NFTTemplate';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from '../screen/CreateOneKindContract';

type CreateNFTTrait = {
  key: string;
  value: string;
};

export type CreateNFTOneKind = {
  dataUri: string;
  choosenTemplate: NFTTemplateAsset;
  state: OneKindContractForm;
  status: OneKindContractStatusForm;
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
  choosenTemplate: NFTTemplateAsset;
  state: CreateNFTPackState;
  status: any;
};
