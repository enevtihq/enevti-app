import { NFTRecurring } from '../../chain/nft/NFTRedeem';
import { NFTUtility } from '../../chain/nft/NFTUtility';

export type CreateOneKindNFTProps = {
  name: string;
  description: string;
  mintingType: string;
  symbol: string;
  cover: string;
  coverMime: string;
  coverExtension: string;
  coverSize: number;
  coverProtocol: string;
  data: string;
  dataMime: string;
  dataExtension: string;
  dataSize: number;
  dataProtocol: string;
  utility: NFTUtility;
  template: string;
  cipher: string;
  signature: string;
  content: string;
  contentMime: string;
  contentExtension: string;
  contentSize: number;
  contentProtocol: string;
  contentIv: string;
  contentSalt: string;
  contentSecurityVersion: number;
  recurring: NFTRecurring;
  time: {
    day: string;
    date: string;
    month: string;
    year: string;
  };
  from: {
    hour: string;
    minute: string;
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
  mintingExpire: string;
};

export type CreateOneKindNFTUI = Omit<
  CreateOneKindNFTProps,
  'price' | 'time' | 'from' | 'mintingExpire'
> & {
  price: { amount: string; currency: string };
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
  mintingExpire: number;
};
