import { NFTPrice } from '../../nft/NFTPrice';
import { SocialProfile } from '../../social';
import { Persona } from './persona';

export type Collection = {
  id: string;
  collectionType: string;
  name: string;
  description: string;
  cover: string;
  symbol: string;
  createdOn: number;
  like: number;
  comment: number;
  social: SocialProfile;
  packSize: number;
  stat: {
    minted: number;
    owner: number;
    redeemed: number;
    floor: NFTPrice;
    volume: NFTPrice;
  };
  minting: {
    total: number;
    available: number;
    expire: number;
    price: NFTPrice;
  };
  minted: string[];
  originAddress: Persona;
  activity: {
    transaction: string;
    name: string;
    serial: number;
    date: number;
    from: Persona;
    to: Persona;
    value: NFTPrice;
  }[];
};
