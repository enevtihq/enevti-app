import { NFTRecurring } from '../../chain/nft/NFTRedeem';
import { NFTUtility } from '../../chain/nft/NFTUtility';

export type CreateNFTOneKindNFTProps = {
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
  utility: NFTUtility;
  template: string;
  cipher: string;
  signature: string;
  content: string;
  contentMime: string;
  contentExtension: string;
  contentSize: number;
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
