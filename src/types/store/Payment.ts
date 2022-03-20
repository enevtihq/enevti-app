export type PaymentAction = {
  type: 'createNFTOneKind' | '';
  icon: string;
  name: string;
  description: string;
  amount: bigint;
  currency: string;
  payload: string;
};

export type PaymentFee = {
  gas: bigint;
  platform: bigint;
};

export type PaymentStatus = {
  type: 'idle' | 'initiated' | 'process' | 'success' | 'error';
  message: string;
};

export type PaymentState = {
  show: boolean;
  mode: 'full' | 'compact' | 'silent';
  status: PaymentStatus;
  action: PaymentAction;
  fee: PaymentFee;
};
