import { NFTRecurring } from 'enevti-app/types/core/chain/nft/NFTRedeem';
import { NFTUtility } from 'enevti-app/types/core/chain/nft/NFTUtility';

export type OneKindContractForm = {
  name: string;
  description: string;
  symbol: string;
  coverName: string;
  coverSize: number;
  coverType: string;
  coverExtension: string;
  coverUri: string;
  utility: NFTUtility;
  contentName: string;
  contentSize: number;
  contentType: string;
  contentExtension: string;
  contentUri: string;
  recurring: NFTRecurring;
  timeDay: number;
  timeDate: number;
  timeMonth: number;
  timeYear: number;
  fromHour: number;
  fromMinute: number;
  untilHour: number;
  untilMinute: number;
  redeemLimitOption: string;
  redeemLimit: string;
  royaltyCreator: string;
  royaltyStaker: string;
  priceAmount: string;
  priceCurrency: string;
  quantity: string;
  mintingExpireOption: string;
  mintingExpire: string;
};

export type OneKindContractStatusForm = {
  nameAvailable: boolean;
  symbolAvailable: boolean;
};
