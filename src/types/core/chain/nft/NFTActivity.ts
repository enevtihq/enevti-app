import { ActivityBase, ActivityChainBase } from '../activity';

export type NFTActivityName = 'mint' | 'redeem' | 'secretDelivered';

export type NFTActivity = Omit<ActivityBase, 'name'> & {
  name: NFTActivityName;
};

export type NFTActivityAsset = Buffer;

export type NFTActivityChainItems = Omit<ActivityChainBase, 'name'> & {
  name: NFTActivityName;
};

export type NFTActivityChain = {
  items: NFTActivityChainItems[];
};
