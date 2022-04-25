import { NFTBase } from '../chain/nft';
import { NFTPrice } from '../chain/nft/NFTPrice';
import { Persona } from '../account/persona';

export interface FeedItem {
  type: string;
  id: string;
  like: number;
  comment: number;
  price: NFTPrice;
  name: string;
  description: string;
  promoted: boolean;
  owner: Persona;
  stake: string;
  delegate: boolean;
  nft: NFTBase[];
}

export type Feeds = FeedItem[];

export interface MomentItem {
  id: string;
  username: string;
  photo: string;
}

export type Moments = MomentItem[];
