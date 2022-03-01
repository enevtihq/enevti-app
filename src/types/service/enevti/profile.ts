import { NFTBase } from '../../nft';

export type Profile = {
  nftSold: number;
  treasuryAct: number;
  serveRate: number;
  stake: string;
  balance: string;
  twitter: {
    username: string;
    follower: number;
  };
  owned: NFTBase[];
  onsale: NFTBase[];
  minted: any[];
};
