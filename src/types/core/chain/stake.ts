import { Persona, PersonaAsset } from '../account/persona';

export type StakerItem = {
  persona: Persona;
  rank: number;
  stake: string;
  portion: number;
};

export type StakerItemAsset = Omit<StakerItem, 'persona' | 'stake'> & {
  persona: PersonaAsset;
  stake: bigint;
};

export type StakePoolData = {
  owner: Persona;
  staker: StakerItem[];
};

export type StakePoolDataAsset = Omit<StakePoolData, 'owner' | 'staker'> & {
  owner: PersonaAsset;
  staker: StakerItemAsset;
};

export type StakerChain = {
  total: bigint;
  items: StakerItemAsset[];
};
