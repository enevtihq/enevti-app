import { Persona } from '../service/enevti/persona';
import { NFTPrice } from './NFTPrice';

export type NFTActivity = {
  transaction: string;
  name: string;
  date: number;
  to: Persona;
  value: NFTPrice;
};
