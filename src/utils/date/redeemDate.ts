import { NFT } from 'enevti-app/types/core/chain/nft';
import i18n from 'enevti-app/translations/i18n';

type RedeemTimeOffset = {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
};

export function dateOfNearestDay(startingDate: Date, nearestDay: number) {
  const nearestTime = new Date(startingDate.getTime());

  if (startingDate.getDay() === 6 && nearestDay === 5) {
    nearestTime.setDate(startingDate.getDate() + ((7 + nearestDay - startingDate.getDay()) % 7) - 7);
  } else {
    nearestTime.setDate(startingDate.getDate() + ((7 + nearestDay - startingDate.getDay()) % 7));
  }

  return nearestTime;
}

export function getRedeemTimeUTC(nft: NFT, offset?: RedeemTimeOffset) {
  let time = 0;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const nftTime = { ...nft.redeem.schedule.time, ...nft.redeem.schedule.from };

  if (nft.redeem.schedule.recurring === 'anytime') {
    throw Error(i18n.t('error:invalidRecurring'));
  }

  switch (nft.redeem.schedule.recurring) {
    case 'daily':
      time = new Date(
        Date.UTC(
          year + (offset && offset.year ? offset.year : 0),
          month + (offset && offset.month ? offset.month : 0),
          date + (offset && offset.date ? offset.date : 0),
          nftTime.hour + (offset && offset.hour ? offset.hour : 0),
          nftTime.minute + (offset && offset.minute ? offset.minute : 0),
        ),
      ).setDate(date);
      break;
    case 'weekly':
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        dateOfNearestDay(now, nftTime.day).getDate() + (offset && offset.date ? offset.date : 0),
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

export function getRedeemDateUTC(nft: NFT) {
  return new Date(getRedeemTimeUTC(nft));
}

export function isRedeemTimeUTC(nft: NFT) {
  if (nft.redeem.schedule.recurring === 'anytime' || nft.utility === 'content') {
    return true;
  }

  const now = Date.now();
  const redeemStartTime = getRedeemTimeUTC(nft);
  const redeemEndTime = redeemStartTime + nft.redeem.schedule.until;
  return redeemStartTime < now && now < redeemEndTime;
}
