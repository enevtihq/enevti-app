export interface AppTransaction<T> {
  moduleID: number;
  assetID: number;
  fee: string;
  asset: T;
  nonce: string;
  senderPublicKey: string;
}

export type NodeInfoFeesResponse = {
  networkIdentifier: string;
  minFeePerByte: number;
  baseFees: unknown[];
};

export type TransactionStatus = 'sent' | 'pending' | 'not-found';
