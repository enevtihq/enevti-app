import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplate } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';
import { NFTRedeemBase } from './NFTRedeem';

export type NFTBase = {
  id: string;
  serial: string;
  name: string;
  contentType: 'image';
  data: string;
  template: {
    main: NFTTemplate;
    thumbnail: NFTTemplate;
  };
  NFTType: NFTType;
  utility: NFTUtility;
  redeem: NFTRedeemBase;
  rarity: NFTRarity;
};
