export type MintNFTByQR = {
  id: string;
  quantity: number;
  nonce: number;
  publicKey: string;
};

export type MintNFTByQRProps = {
  payload: string;
  signature: string;
};

export type MintNFTByQRUI = MintNFTByQRProps;
