import { CreateOneKindNFTProps } from 'enevti-app/types/core/asset/redeemable_nft/create_onekind_nft_asset';
import { NFTTemplateAsset } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from 'enevti-app/types/ui/screen/CreateOneKindContract';

type CreateNFTTrait = {
  key: string;
  value: string;
};

type CreateNFTData = {
  uri: string;
  mime: string;
  extension: string;
  size: number;
};

export type CreateNFTOneKind = {
  data: CreateNFTData;
  choosenTemplate: NFTTemplateAsset;
  state: OneKindContractForm;
  status: OneKindContractStatusForm;
  transaction?: CreateOneKindNFTProps;
};

export type CreateNFTPackItemData = {
  uri: string;
  mime: string;
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
    creator: number;
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
  data: CreateNFTPackItemData[];
  choosenTemplate: NFTTemplateAsset;
  state: CreateNFTPackState;
  status: any;
};
