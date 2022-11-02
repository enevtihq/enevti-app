import { Persona, PersonaAsset } from '../account/persona';
import { MomentIdAsset, NFTIdAsset } from './id';
import { NFTContent } from './nft/NFTContent';

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
  like: number;
  comment: number;
  clubs: number;
  createdOn: number;
}

export interface MomentAsset extends Omit<Moment, 'id' | 'nftId' | 'owner' | 'creator' | 'createdOn'> {
  id: MomentIdAsset;
  nftId: NFTIdAsset;
  owner: PersonaAsset;
  creator: PersonaAsset;
  createdOn: bigint;
}
