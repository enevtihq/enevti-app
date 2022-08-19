import { NFTRarity } from './NFTRarity';
import { NFTType } from './NFTType';
import { NFTTemplateData } from './NFTTemplate';
import { NFTUtility } from './NFTUtility';
import { NFTPrice, NFTPriceAsset } from './NFTPrice';
import { Persona, PersonaAsset } from '../../account/persona';
import { NFTPartition, NFTPartitionAsset } from './NFTPartition';
import { NFTRedeem, NFTRedeemAsset } from './NFTRedeem';
import { NFTRoyalty } from './NFTRoyalty';
import { NFTActivity } from './NFTActivity';
import { NFTContent } from './NFTContent';
import { CollectionIdAsset, NFTIdAsset } from '../id';

export type AllNFT = {
  items: NFTIdAsset[];
};

export type NFTBase = {
  id: string;
  like: number;
  name: string;
  symbol: string;
  serial: string;
  data: NFTContent;
  template: NFTTemplateData;
  nftType: NFTType;
  utility: NFTUtility;
  partition: NFTPartition;
  rarity: NFTRarity;
  price: NFTPrice;
  onSale: boolean;
};

export interface NFT extends NFTBase {
  collectionId: string;
  redeem: NFTRedeem;
  comment: number;
  clubs: number;
  description: string;
  createdOn: number;
  owner: Persona;
  creator: Persona;
  networkIdentifier: string;
  royalty: NFTRoyalty;
  activity: NFTActivity[];
}

export interface NFTAsset
  extends Omit<
    NFT,
    | 'id'
    | 'collectionId'
    | 'owner'
    | 'creator'
    | 'activity'
    | 'template'
    | 'redeem'
    | 'price'
    | 'partition'
    | 'networkIdentifier'
    | 'createdOn'
  > {
  id: NFTIdAsset;
  collectionId: CollectionIdAsset;
  owner: PersonaAsset;
  creator: PersonaAsset;
  template: string;
  redeem: NFTRedeemAsset;
  price: NFTPriceAsset;
  partition: NFTPartitionAsset;
  networkIdentifier: Buffer;
  createdOn: bigint;
}
