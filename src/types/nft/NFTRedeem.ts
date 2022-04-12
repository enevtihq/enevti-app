import { NFTContentSecure } from './NFTContent';
import { NFTSecret } from './NFTSecret';

export type NFTRedeem = {
  status: 'ready' | 'pending-secret' | 'limit-exceeded' | '';
  count: number;
  limit: number;
  touched: number;
  secret: NFTSecret;
  content: NFTContentSecure;
  schedule: {
    recurring: string;
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
    timezoneOffset: number;
  };
};
