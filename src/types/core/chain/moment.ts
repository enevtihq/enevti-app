import { Persona, PersonaAsset } from '../account/persona';
import { ActivityBase, ActivityChainBase } from './activity';
import { MomentIdAsset, NFTIdAsset } from './id';
import { NFTBase } from './nft';
import { NFTContent } from './nft/NFTContent';

export type AllMoment = {
  items: MomentIdAsset[];
};

export type MomentActivityName = 'minted';

export type MomentActivity = Omit<ActivityBase, 'name'> & {
  name: MomentActivityName;
};

export type MomentActivityAsset = Buffer;

export type MomentActivityChainItems = Omit<ActivityChainBase, 'name'> & {
  name: MomentActivityName;
};

export type MomentActivityChain = {
  items: MomentActivityChainItems[];
};

export type MomentAtAsset = {
  moment: MomentIdAsset[];
};

export interface Moment {
  id: string;
  cover: NFTContent;
  like: number;
  text: string;
  textPlain?: string;
  liked?: boolean;

  nftId: string;
  nft?: NFTBase;
  owner: Persona;
  creator: Persona;
  data: NFTContent;
  comment: number;
  clubs: number;
  createdOn: number;
  activity?: MomentActivity[];
}

export type MomentBase = Moment;

export interface MomentAsset
  extends Omit<
    Moment,
    'id' | 'nftId' | 'activity' | 'owner' | 'creator' | 'createdOn' | 'textPlain' | 'nft' | 'liked'
  > {
  id: MomentIdAsset;
  nftId: NFTIdAsset;
  owner: PersonaAsset;
  creator: PersonaAsset;
  createdOn: bigint;
}
