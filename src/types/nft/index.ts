import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplateData } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';
import { NFTRedeemBase } from './NFTRedeem';

export type NFTBase = {
  id: string;
  name: string;
  symbol: string;
  serial: string;
  data: string;
  dataMime: 'image/jpeg';
  template: NFTTemplateData;
  NFTType: NFTType;
  utility: NFTUtility;
  redeem: NFTRedeemBase;
  rarity: NFTRarity;
};
