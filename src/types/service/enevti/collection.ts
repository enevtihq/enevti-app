import { NFTPrice } from '../../nft/NFTPrice';
import { SocialProfile } from '../../social';

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
    total: number;
    owner: number;
    floor: NFTPrice;
    volume: NFTPrice;
  };
  available: string[];
  minted: string[];
  mintingExpire: number;
  originAddress: string;
  price: NFTPrice;
  activity: {
    transaction: string;
    name: string;
    serial: number;
    date: number;
    from: string;
    to: string;
    value: NFTPrice;
  }[];
};
