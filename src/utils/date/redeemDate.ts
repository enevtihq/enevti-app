import { NFT } from 'enevti-app/types/nft';
import { dateOfNearestDay } from './calendar';

type RedeemTimeOffset = {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
};

export function getRedeemTime(nft: NFT, offset?: RedeemTimeOffset) {
  let time: number = 0;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const nftTime = { ...nft.redeem.schedule.time, ...nft.redeem.schedule.from };

  switch (nft.redeem.schedule.recurring) {
    case 'daily':
      time = new Date(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      ).getTime();
      break;
    case 'weekly':
      time = new Date(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        dateOfNearestDay(now, nftTime.day).getDate() +
          (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      ).getTime();
      break;
    case 'monthly':
      time = new Date(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      ).getTime();
      break;
    case 'yearly':
      time = new Date(
        year + (offset && offset.year ? offset.year : 0),
        nftTime.month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      ).getTime();
      break;
    case 'once':
      time = new Date(
        nftTime.year + (offset && offset.year ? offset.year : 0),
        nftTime.month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      ).getTime();
      break;
    default:
      break;
  }

  return time;
}

export function getRedeemTimeUTC(nft: NFT, offset?: RedeemTimeOffset) {
  let time: number = 0;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const nftTime = { ...nft.redeem.schedule.time, ...nft.redeem.schedule.from };

  switch (nft.redeem.schedule.recurring) {
    case 'daily':
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      break;
    case 'weekly':
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        dateOfNearestDay(now, nftTime.day).getDate() +
          (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      break;
    case 'monthly':
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      break;
    case 'yearly':
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        nftTime.month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      break;
    case 'once':
      time = Date.UTC(
        nftTime.year + (offset && offset.year ? offset.year : 0),
        nftTime.month + (offset && offset.month ? offset.month : 0),
        nftTime.date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      break;
    default:
      break;
  }

  return time;
}
