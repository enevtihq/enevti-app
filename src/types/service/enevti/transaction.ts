export type CreateNFTOneKindTransaction = {
  name: string;
  description: string;
  symbol: string;
  cover: string;
  data: string;
  dataMime: string;
  dataSize: number;
  utility: string;
  content: string;
  contentMime: string;
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
    origin: number;
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
