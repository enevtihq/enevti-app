import { NFTBase } from 'enevti-app/types/nft';
import { SocialProfile } from 'enevti-app/types/social';

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
