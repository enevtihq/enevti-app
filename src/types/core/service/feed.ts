import { NFTBase } from '../chain/nft';
import { NFTPrice } from '../chain/nft/NFTPrice';
import { Persona } from '../account/persona';
import { NFTType } from '../chain/nft/NFTType';
import { MomentBase } from '../chain/moment';
import { ProfileAPIResponse } from '../account/profile';

export interface FeedItem {
  type: NFTType | 'nft';
  id: string;
  like: number;
  liked: boolean;
  comment: number;
  price: NFTPrice;
  name: string;
  description: string;
  promoted: boolean;
  owner: Persona;
  stake: string;
  delegate: boolean;
  total: number;
  minted: number;
  expire: number;
  nft: NFTBase[];
}

export type Feeds = FeedItem[];

export type MomentItem = MomentBase;

export type Moments = MomentItem[];

export type HomeFeeds = {
  profile: ProfileAPIResponse;
  feed: Feeds;
  moment: Moments;
};
