import { NFTBase } from '../../nft';
import { SocialProfile } from '../../social';

export type Profile = {
  nftSold: number;
  treasuryAct: number;
  serveRate: number;
  stake: string;
  balance: string;
  social: SocialProfile;
  owned: NFTBase[];
  onsale: NFTBase[];
  collection: any[];
};
