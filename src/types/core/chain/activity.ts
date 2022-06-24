import { Persona, PersonaAsset } from '../account/persona';
import { NFTPrice, NFTPriceAsset } from './nft/NFTPrice';

export type ActivityBase = {
  transaction: string;
  name: string;
  date: number;
  to: Persona;
  value: NFTPrice;
};

export type ActivityChainBase = Omit<ActivityBase, 'transaction' | 'to' | 'value' | 'date'> & {
  transaction: Buffer;
  to: PersonaAsset;
  value: NFTPriceAsset;
  date: bigint;
};
