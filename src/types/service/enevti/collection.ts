import { NFTBase } from 'enevti-app/types/nft';
import { NFTPrice } from 'enevti-app/types/nft/NFTPrice';
import { SocialProfile } from 'enevti-app/types/social';
import { Persona } from './persona';
import { NFTActivity } from 'enevti-app/types/nft/NFTActivity';

export type CollectionActivity = NFTActivity & { nft: NFTBase };

export type CollectionBase = {
  id: string;
  name: string;
  cover: string;
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
  collectionType: 'onekind' | 'packed' | '';
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
}
