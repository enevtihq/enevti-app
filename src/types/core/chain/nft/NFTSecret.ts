export type NFTSecret = {
  cipher: string;
  signature: {
    cipher: string;
    plain: string;
  };
  sender: string;
  recipient: string;
};

export type NFTSecretAsset = {
  cipher: string;
  signature: {
    cipher: string;
    plain: string;
  };
  sender: Buffer;
  recipient: Buffer;
};
