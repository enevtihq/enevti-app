import { Persona, PersonaAsset } from '../account/persona';
import { ActivityBase, ActivityChainBase } from './activity';
import { MomentIdAsset, NFTIdAsset } from './id';
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

export type MomentBase = {
  id: string;
  cover: NFTContent;
};

export interface Moment extends MomentBase {
  nftId: string;
  owner: Persona;
  creator: Persona;
  data: NFTContent;
  text: string;
  textPlain?: string;
  like: number;
  comment: number;
  clubs: number;
  createdOn: number;
  activity?: MomentActivity[];
}

export interface MomentAsset extends Omit<Moment, 'id' | 'nftId' | 'activity' | 'owner' | 'creator' | 'createdOn'> {
  id: MomentIdAsset;
  nftId: NFTIdAsset;
  owner: PersonaAsset;
  creator: PersonaAsset;
  createdOn: bigint;
}
