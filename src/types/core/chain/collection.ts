import { NFTBase } from './nft';
import { NFTPrice, NFTPriceAsset } from './nft/NFTPrice';
import { Persona, PersonaAsset } from '../account/persona';
import { NFTActivity, NFTActivityChainItems } from './nft/NFTActivity';
import { NFTContent } from './nft/NFTContent';
import { SocialProfile, SocialProfileAsset } from '../account/social';
import { CollectionIdAsset, NFTIdAsset } from './id';
import { NFTType } from './nft/NFTType';

export type AllCollection = {
  items: CollectionIdAsset[];
};

export type CollectionActivityName = 'created' | 'minted';

export type CollectionActivity = Omit<NFTActivity, 'name'> & {
  name: CollectionActivityName;
  nfts: NFTBase[];
};

export type CollectionActivityAsset = Buffer;

export type CollectionActivityChainItems = Omit<NFTActivityChainItems, 'name'> & {
  name: CollectionActivityName;
  nfts: NFTIdAsset[];
};

export type CollectionActivityChain = {
  items: CollectionActivityChainItems[];
};

export type CollectionBase = {
  id: string;
  name: string;
  cover: NFTContent;
  stat: {
    minted: number;
    owner: number;
    redeemed: number;
    floor: NFTPrice;
    volume: NFTPrice;
  };
  minting: {
    total: number;
    available: number;
    expire: number;
    price: NFTPrice;
  };
};

export interface Collection extends CollectionBase {
  collectionType: NFTType;
  mintingType: string;
  description: string;
  symbol: string;
  createdOn: number;
  like: number;
  comment: number;
  social: SocialProfile;
  packSize: number;
  minted: NFTBase[];
  creator: Persona;
  activity: CollectionActivity[];
  promoted: boolean;
}

export interface CollectionAsset
  extends Omit<
    Collection,
    'creator' | 'id' | 'minted' | 'activity' | 'social' | 'stat' | 'minting'
  > {
  id: CollectionIdAsset;
  creator: PersonaAsset;
  minted: NFTIdAsset[];
  social: SocialProfileAsset;
  stat: {
    minted: number;
    owner: Buffer[];
    redeemed: number;
    floor: NFTPriceAsset;
    volume: NFTPriceAsset;
  };
  minting: {
    total: NFTIdAsset[];
    available: NFTIdAsset[];
    expire: number;
    price: NFTPriceAsset;
  };
}
