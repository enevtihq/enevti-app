import { NFTRarity } from './NFTRarity';
import { NFTTemplate } from './template';
import { NFTUtility } from './utility';

export type NFT = {
  serial: string;
  name: string;
  contentType: 'image';
  data: string;
  template: NFTTemplate;
  utility: NFTUtility;
  rarity: NFTRarity;
};
