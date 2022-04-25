import { Persona, PersonaAsset } from '../../account/persona';
import { NFTPrice, NFTPriceAsset } from './NFTPrice';

export type NFTActivityName = 'mint' | 'redeem';

export type NFTActivity = {
  transaction: string;
  name: NFTActivityName;
  date: number;
  to: Persona;
  value: NFTPrice;
};

export type NFTActivityAsset = Buffer;

export type NFTActivityChainItems = Omit<NFTActivity, 'transaction' | 'to' | 'value'> & {
  transaction: Buffer;
  to: PersonaAsset;
  value: NFTPriceAsset;
};

export type NFTActivityChain = {
  items: NFTActivityChainItems[];
};
