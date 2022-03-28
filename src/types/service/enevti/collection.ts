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
    minted: number;
    owner: number;
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
  originAddress: string;
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
