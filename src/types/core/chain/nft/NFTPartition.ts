import { NFTIdAsset } from '../id';

export type NFTPartition = {
  parts: string[];
  upgradeMaterial: number;
};

export type NFTPartitionAsset = {
  parts: NFTIdAsset[];
  upgradeMaterial: number;
};
