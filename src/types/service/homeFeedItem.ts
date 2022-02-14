import { NFTBase } from '../nft';

export interface HomeFeedItemResponse {
  type: string;
  id: string;
  like: number;
  comment: number;
  price: string;
  name: string;
  description: string;
  promoted: boolean;
  owner: string;
  username: string;
  photo: string;
  stake: string;
  nft: NFTBase[];
}

export type HomeFeedResponse = HomeFeedItemResponse[];

export interface HomeMomentsItemResponse {
  id: string;
  username: string;
  photo: string;
}

export type HomeMomentsResponse = HomeMomentsItemResponse[];
