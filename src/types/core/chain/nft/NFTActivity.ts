import { Persona, PersonaAsset } from '../../account/persona';
import { NFTPrice, NFTPriceAsset } from './NFTPrice';

export type NFTActivityName = 'mint' | 'redeem' | 'secretDelivered';

export type NFTActivity = {
  transaction: string;
  name: NFTActivityName;
  date: number;
  to: Persona;
  value: NFTPrice;
};

export type NFTActivityAsset = Buffer;

export type NFTActivityChainItems = Omit<NFTActivity, 'transaction' | 'to' | 'value' | 'date'> & {
  transaction: Buffer;
  to: PersonaAsset;
  value: NFTPriceAsset;
  date: bigint;
};

export type NFTActivityChain = {
  items: NFTActivityChainItems[];
};
