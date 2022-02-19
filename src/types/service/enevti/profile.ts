import { NFTBase } from '../../nft';

export type ProfileResponse = {
  owned: NFTBase[];
  onsale: NFTBase[];
  minted: any[];
};
