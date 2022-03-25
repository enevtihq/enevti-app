import { NFTBase } from '../../nft';
import { NFTPrice } from '../../nft/NFTPrice';

export interface FeedItem {
  type: string;
  id: string;
  like: number;
  comment: number;
  price: NFTPrice;
  name: string;
  description: string;
  promoted: boolean;
  owner: string;
  username: string;
  photo: string;
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
