import { NFTRecurring } from 'enevti-types/chain/nft/NFTRedeem';
import { NFTUtility } from 'enevti-types/chain/nft/NFTUtility';

export type OneKindContractForm = {
  name: string;
  description: string;
  mintingType: string;
  storageProtocol: string;
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
  redeemNonceLimit: string;
  redeemCountLimit: string;
  royaltyCreator: string;
  royaltyStaker: string;
  priceAmount: string;
  priceCurrency: string;
  quantity: string;
  mintingExpireOption: string;
  mintingExpire: string;
  raffled: number;
  raffledTouched: boolean;
};

export type OneKindContractStatusForm = {
  nameAvailable: boolean;
  symbolAvailable: boolean;
};
