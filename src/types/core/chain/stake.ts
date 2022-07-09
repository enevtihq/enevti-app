import { Persona, PersonaAsset } from '../account/persona';

export type StakerItem = {
  id: string;
  persona: Persona;
  rank: number;
  stake: string;
  portion: number;
};

export type StakerItemUtils = {
  id: Buffer;
  persona: PersonaAsset;
  stake: bigint;
};

export type StakerItemAsset = Omit<StakerItem, 'id' | 'persona' | 'stake'> & { id: Buffer } & StakerItemUtils;

export type StakePoolData = {
  owner: Persona;
  staker: StakerItem[];
};

export type StakerChain = {
  total: bigint;
  items: StakerItemAsset[];
};
