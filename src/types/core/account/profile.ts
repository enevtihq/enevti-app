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

export type RedeemableNFTAccountStatsChain = {
  nftSold: Buffer[];
  treasuryAct: Buffer[];
  raffled: Buffer[];
  serveRate: {
    score: number;
    items: {
      id: Buffer;
      nonce: number;
      status: 0 | 1;
    }[];
  };
  likeSent: {
    total: number;
    nft: Buffer[];
    collection: Buffer[];
    comment: Buffer[];
    reply: Buffer[];
  };
};

export type RedeemableNFTAccountProps = {
  redeemableNft: {
    nftSold: number;
    treasuryAct: number;
    serveRate: number;
    raffled: number;
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
  | 'deliverSecret'
  | 'winRaffle';

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

export type EngagementActivityName =
  | 'likeNft'
  | 'likeCollection'
  | 'likeComment'
  | 'likeReply'
  | 'commentNft'
  | 'commentCollection'
  | 'replyComment';

export type EngagementActivity = Omit<ActivityBase, 'name' | 'to' | 'value'> & {
  name: EngagementActivityName;
  target: Record<string, unknown>;
};

export type EngagementActivityAsset = Buffer;

export type EngagementActivityChainItems = Omit<ActivityChainBase, 'name' | 'to' | 'value'> & {
  name: EngagementActivityName;
  target: Buffer;
};

export type EngagementActivityChain = {
  items: EngagementActivityChainItems[];
};
