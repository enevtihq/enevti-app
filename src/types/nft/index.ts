import { NFTTemplate } from './template';
import { NFTUtility } from './utility';

export type NFT = {
  contentType: 'image';
  data: string;
  utility: NFTUtility;
  template: NFTTemplate;
};
