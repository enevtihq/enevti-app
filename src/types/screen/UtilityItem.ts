import { NFTUtility } from '../nft/NFTUtility';

export type UtilityItem = {
  name: NFTUtility | undefined;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
};
