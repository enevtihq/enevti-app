export type PaymentAction = {
  type: 'createNFTOneKind' | 'mintCollection' | 'addStake' | 'cancel' | '';
  icon: string;
  name: string;
  description: string;
  details?: string;
  amount: bigint;
  currency: string;
  payload: string;
};

export type PaymentFee = {
  gas: bigint;
  platform: bigint;
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
