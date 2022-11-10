export type NFTContent = {
  cid: string;
  mime: string;
  extension: string;
  size: number;
  protocol: string;
};

export interface NFTContentSecure extends NFTContent {
  security: string;
}
