export type NFTSecret = {
  cipher: string;
  signature: string;
  sender: string;
  recipient: string;
};

export type NFTSecretAsset = {
  cipher: string;
  signature: string;
  sender: Buffer;
  recipient: Buffer;
};
