import { NFTBase } from '../chain/nft';
import { CollectionBase } from '../chain/collection';
import { SocialProfile } from './social';
import { CollectionIdAsset, NFTIdAsset } from '../chain/id';
import { Persona } from './persona';

export type ProfileView = Profile & { persona: Persona };

export type Profile = {
  balance: string;
  stake: string;
  social: SocialProfile;
  nftSold: number;
  treasuryAct: number;
  serveRate: number;
  owned: NFTBase[];
  onSale: NFTBase[];
  collection: CollectionBase[];
};

export type RedeemableNFTAccountProps = {
  redeemableNft: {
    nftSold: number;
    treasuryAct: number;
    serveRate: number;
    owned: NFTIdAsset[];
    onSale: NFTIdAsset[];
    collection: CollectionIdAsset[];
  };
};

export type CreaFiAccountProps = {
  creatorFinance: {
    totalStake: bigint;
  };
};
