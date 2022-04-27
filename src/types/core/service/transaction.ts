export interface AppTransaction<T> {
  moduleID: number;
  assetID: number;
  fee: bigint;
  asset: T;
  nonce: bigint;
  senderPublicKey: Buffer;
}

export type NodeInfoFeesResponse = {
  networkIdentifier: string;
  minFeePerByte: number;
  baseFees: unknown[];
};
