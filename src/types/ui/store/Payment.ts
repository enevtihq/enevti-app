export type PaymentAction = {
  loaded: boolean;
  type: 'createNFTOneKind' | 'mintCollection' | 'addStake' | 'registerUsername' | 'cancel' | '';
  icon: string;
  name: string;
  description: string;
  details?: string;
  amount: string;
  currency: string;
  payload: string;
};

export type PaymentFee = {
  loaded: boolean;
  gas: string;
  platform: string;
};

export type PaymentStatus = {
  type: 'idle' | 'initiated' | 'process' | 'success' | 'error' | 'cancel';
  message: string;
};

export type PaymentState = {
  show: boolean;
  mode: 'full' | 'compact' | 'silent';
  status: PaymentStatus;
  action: PaymentAction;
  fee: PaymentFee;
};
