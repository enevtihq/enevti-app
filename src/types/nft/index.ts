import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplateData } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';
import { NFTPrice } from './NFTPrice';
import { Persona } from '../service/enevti/persona';
import { NFTPartition } from './NFTPartition';
import { NFTRedeem } from './NFTRedeem';
import { NFTRoyalty } from './NFTRoyalty';
import { NFTActivity } from './NFTActivity';
import { NFTContent } from './NFTContent';

export type NFTBase = {
  id: string;
  like: number;
  name: string;
  symbol: string;
  serial: string;
  data: NFTContent;
  template: NFTTemplateData;
  NFTType: NFTType;
  utility: NFTUtility;
  partition: NFTPartition;
  rarity: NFTRarity;
  price: NFTPrice;
  onSale: boolean;
};

export interface NFT extends NFTBase {
  redeem: NFTRedeem;
  comment: number;
  description: string;
  createdOn: number;
  ownerAddress: Persona;
  originAddress: Persona;
  originChain: string;
  royalty: NFTRoyalty;
  activity: NFTActivity[];
}
