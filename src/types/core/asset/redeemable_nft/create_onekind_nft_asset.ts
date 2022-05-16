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
  signature: {
    cipher: string;
    plain: string;
  };
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

export type CreateOneKindNFTUI = Omit<CreateOneKindNFTProps, 'price'> & {
  price: { amount: string; currency: string };
};
