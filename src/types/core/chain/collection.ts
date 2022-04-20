import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { NFTPrice } from 'enevti-app/types/core/chain/nft/NFTPrice';
import { Persona } from '../account/persona';
import { NFTActivity } from 'enevti-app/types/core/chain/nft/NFTActivity';
import { NFTContent } from 'enevti-app/types/core/chain/nft/NFTContent';
import { SocialProfile } from 'enevti-app/types/core/account/social';

export type CollectionActivity = NFTActivity & { nft: NFTBase };

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
