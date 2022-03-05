import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplateData } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';
import { NFTRedeemBase } from './NFTRedeem';

export type NFTBase = {
  id: string;
  symbol: string;
  serial: number;
  name: string;
  contentType: 'image';
  data: string;
  template: NFTTemplateData;
  NFTType: NFTType;
  utility: NFTUtility;
  redeem: NFTRedeemBase;
  rarity: NFTRarity;
};
