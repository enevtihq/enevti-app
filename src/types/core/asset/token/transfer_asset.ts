export type TransferTokenProps = {
  amount: bigint;
  recipientAddress: Buffer;
  data: string;
};

export type TransferTokenUI = Omit<TransferTokenProps, 'amount' | 'recipientAddress'> & {
  amount: string;
  recipientAddress: string;
};
