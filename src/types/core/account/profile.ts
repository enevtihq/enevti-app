import { NFTBase } from '../chain/nft';
import { CollectionBase } from '../chain/collection';
import { SocialProfile } from './social';
import { CollectionIdAsset, NFTIdAsset } from '../chain/id';
import { Persona, PersonaAsset } from './persona';
import { ActivityBase, ActivityChainBase } from '../chain/activity';

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
  pending: number;
};

export type RedeemableNFTAccountProps = {
  redeemableNft: {
    nftSold: number;
    treasuryAct: number;
    serveRate: number;
    owned: NFTIdAsset[];
    onSale: NFTIdAsset[];
    collection: CollectionIdAsset[];
    pending: NFTIdAsset[];
  };
};

export type CreaFiAccountProps = {
  creatorFinance: {
    totalStake: bigint;
  };
};

export type ProfileActivityName =
  | 'tokenSent'
  | 'tokenReceived'
  | 'registerUsername'
  | 'addStake'
  | 'selfStake'
  | 'createNFT'
  | 'mintNFT'
  | 'NFTSale'
  | 'deliverSecret';

export type ProfileActivity = Omit<ActivityBase, 'name'> & {
  name: ProfileActivityName;
  from: Persona;
  payload: Record<string, unknown>;
};

export type ProfileActivityAsset = Buffer;

export type ProfileActivityChainItems = Omit<ActivityChainBase, 'name'> & {
  name: ProfileActivityName;
  from: PersonaAsset;
  payload: Buffer;
};

export type ProfileActivityChain = {
  items: ProfileActivityChainItems[];
};
