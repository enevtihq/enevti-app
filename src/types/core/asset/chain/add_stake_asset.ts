import { NFTPrice } from '../../chain/nft/NFTPrice';

export type AddStakeProps = {
  address: string;
  amount: NFTPrice;
};

export type AddStakeUI = AddStakeProps;
