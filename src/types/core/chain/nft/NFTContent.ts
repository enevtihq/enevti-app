export type NFTContent = {
  cid: string;
  mime: string;
  extension: string;
  size: number;
};

export interface NFTContentSecure extends NFTContent {
  iv: string;
  salt: string;
  version: number;
}
