import { Persona } from './persona';

export type StakerItem = {
  persona: Persona;
  rank: number;
  stake: string;
  portion: number;
};

export type StakePoolData = {
  owner: Persona;
  staker: StakerItem[];
};
