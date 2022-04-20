import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { CollectionBase } from '../chain/collection';
import { SocialProfile } from './social';

export type Profile = {
  balance: string;
  stake: string;
  social: SocialProfile;
  nftSold: number;
  treasuryAct: number;
  serveRate: number;
  owned: NFTBase[];
  onsale: NFTBase[];
  collection: CollectionBase[];
};
