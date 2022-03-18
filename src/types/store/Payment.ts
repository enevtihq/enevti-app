export type PaymentItem = {
  name: string;
  description: string;
  amount: string;
  currency: string;
};

export type PaymentAction = {
  type: string;
  title: string;
  description: string;
  payload: string;
};

export type PaymentHeader = {
  icon: string;
  name: string;
  description: string;
};

export type PaymentStatus = {
  type: 'idle' | 'initiated' | 'process' | 'success' | 'error';
  message: string;
};

export type PaymentState = {
  show: boolean;
  status: PaymentStatus;
  header: PaymentHeader;
  item: PaymentItem[];
  action: PaymentAction[];
};
