import { NFTBase } from '../chain/nft';
import { CollectionBase } from '../chain/collection';
import { SocialProfile } from './social';
import { CollectionIdAsset, MomentIdAsset, NFTIdAsset } from '../chain/id';
import { Persona, PersonaAsset } from './persona';
import { ActivityBase, ActivityChainBase } from '../chain/activity';
import { MomentBase } from '../chain/moment';

export type ProfileAPIResponse = Profile & {
  persona?: Persona;
  versions: { owned: number; onSale: number; momentCreated: number; collection: number };
};

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
  raffled: number;
  likeSent: number;
  commentSent: number;
  momentSlot: number;
  momentCreated: MomentBase[];
};

export type RedeemableNFTAccountStatsChain = {
  nftSold: Buffer[];
  treasuryAct: Buffer[];
  raffled: Buffer[];
  momentSlot: Buffer[];
  serveRate: {
    score: number;
    items: {
      id: Buffer;
      nonce: number;
      owner: Buffer;
      status: 0 | 1;
    }[];
  };
  likeSent: {
    total: number;
    nft: Buffer[];
    moment: Buffer[];
    collection: Buffer[];
    comment: Buffer[];
    reply: Buffer[];
    commentClubs: Buffer[];
    replyClubs: Buffer[];
  };
  commentSent: {
    total: number;
    comment: Buffer[];
    reply: Buffer[];
  };
  commentClubsSent: {
    total: number;
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
    momentSlot: number;
    likeSent: number;
    commentSent: number;
    commentClubsSent: number;
    owned: NFTIdAsset[];
    onSale: NFTIdAsset[];
    momentCreated: MomentIdAsset[];
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
  | 'winRaffle'
  | 'momentCreated';

export type ProfileActivity = Omit<ActivityBase, 'name'> & {
  name: ProfileActivityName;
  from: Persona;
  payload: Record<string, unknown>;
  fee: string;
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
  | 'likeMoment'
  | 'likeCommentClubs'
  | 'likeReplyClubs'
  | 'commentNft'
  | 'commentCollection'
  | 'commentMoment'
  | 'replyComment'
  | 'replyCommentClubs'
  | 'commentCollectionClubs'
  | 'commentNftClubs'
  | 'commentMomentClubs'
  | 'setVideoCallAnswered'
  | 'setVideoCallRejected';

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
