export type MintNFTByQR = {
  id: string;
  quantity: number;
  nonce: number;
  publicKey: string;
};

export type MintNFTByQRProps = {
  body: string;
  signature: string;
};

export type MintNFTByQRUI = MintNFTByQRProps;
