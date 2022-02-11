import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplate } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';

export type NFT = {
  serial: string;
  name: string;
  contentType: 'image';
  data: string;
  template: NFTTemplate;
  NFTType: NFTType;
  utility: NFTUtility;
  rarity: NFTRarity;
};
