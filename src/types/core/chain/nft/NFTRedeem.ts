import { NFTContentSecure } from './NFTContent';
import { NFTSecret, NFTSecretAsset } from './NFTSecret';

export type NFTRecurring = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once' | 'anytime' | '';

export type NFTRedeem = {
  status: 'ready' | 'pending-secret' | 'limit-exceeded' | '';
  count: number;
  limit: number;
  touched: number;
  secret: NFTSecret;
  content: NFTContentSecure;
  schedule: {
    recurring: NFTRecurring;
    time: {
      day: number;
      date: number;
      month: number;
      year: number;
    };
    from: {
      hour: number;
      minute: number;
    };
    until: number;
  };
};

export type NFTRedeemAsset = Omit<NFTRedeem, 'secret'> & {
  secret: NFTSecretAsset;
};
