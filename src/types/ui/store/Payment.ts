export type PaymentAction = {
  loaded: boolean;
  type:
    | 'createNFTOneKind'
    | 'mintCollection'
    | 'mintCollectionByQR'
    | 'addStake'
    | 'registerUsername'
    | 'deliverSecret'
    | 'transferToken'
    | 'likeNFT'
    | 'likeCollection'
    | 'commentNFT'
    | 'commentCollection'
    | 'cancel'
    | '';
  icon: string;
  name: string;
  description: string;
  details?: string;
  amount: string;
  currency: string;
  payload: string;
  meta: string;
};

export type PaymentFee = {
  loaded: boolean;
  priority: 'low' | 'normal' | 'high' | 'custom';
  gas: string;
  base: string;
  platform: string;
};

export type PaymentStatus = {
  type: 'idle' | 'initiated' | 'process' | 'success' | 'error' | 'cancel';
  action?: PaymentAction['type'];
  message: string;
};

export type PaymentState = {
  show: boolean;
  mode: 'full' | 'compact' | 'silent';
  status: PaymentStatus;
  action: PaymentAction;
  fee: PaymentFee;
};
