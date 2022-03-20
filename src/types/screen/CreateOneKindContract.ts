export type OneKindContractForm = {
  name: string;
  description: string;
  symbol: string;
  coverName: string;
  coverSize: number;
  coverType: string;
  coverUri: string;
  utility: string;
  contentName: string;
  contentSize: number;
  contentType: string;
  contentUri: string;
  recurring: string;
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
  royaltyOrigin: string;
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
