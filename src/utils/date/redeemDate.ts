import { NFT } from 'enevti-types/chain/nft';
import i18n from 'enevti-app/translations/i18n';
import moment from 'moment';

type RedeemTimeOffset = {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
};

export const isTimeBetweenDailyUTC = (startTime: string, endTime: string, currentTime: string) => {
  const start = moment.utc(startTime, 'HH:mm:ss');
  const end = moment.utc(endTime, 'HH:mm:ss');
  const current = moment.utc(currentTime, 'HH:mm:ss');
  if (end < start) {
    return (
      (current >= start && current <= moment.utc('23:59:59', 'HH:mm:ss')) ||
      (current >= moment.utc('00:00:00', 'HH:mm:ss') && current < end)
    );
  }
  return current >= start && current < end;
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

export function dateOfNearestDayUTC(startingDate: Date, nearestDayUTC: number) {
  const nearestTime = new Date(startingDate.getTime());

  if (startingDate.getUTCDay() === 6 && nearestDayUTC === 5) {
    nearestTime.setDate(startingDate.getUTCDate() + ((7 + nearestDayUTC - startingDate.getUTCDay()) % 7) - 7);
  } else {
    nearestTime.setDate(startingDate.getUTCDate() + ((7 + nearestDayUTC - startingDate.getUTCDay()) % 7));
  }

  return nearestTime;
}

export function getRedeemTimeUTC(nft: NFT, offset?: RedeemTimeOffset) {
  let time = 0;
  let redeemStartTimeDate = new Date();
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
      time = Date.UTC(
        year + (offset && offset.year ? offset.year : 0),
        month + (offset && offset.month ? offset.month : 0),
        date + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      redeemStartTimeDate = new Date(time);
      now.setHours(redeemStartTimeDate.getHours());
      now.setMinutes(redeemStartTimeDate.getMinutes());
      time = now.getTime();
      break;
    case 'weekly':
      const nearestTimeUTC = dateOfNearestDayUTC(now, nftTime.day);
      time = Date.UTC(
        nearestTimeUTC.getUTCFullYear() + (offset && offset.year ? offset.year : 0),
        nearestTimeUTC.getUTCMonth() + (offset && offset.month ? offset.month : 0),
        nearestTimeUTC.getUTCDate() + (offset && offset.date ? offset.date : 0),
        nftTime.hour + (offset && offset.hour ? offset.hour : 0),
        nftTime.minute + (offset && offset.minute ? offset.minute : 0),
      );
      redeemStartTimeDate = new Date(time);
      const nearestTime = dateOfNearestDay(now, new Date(time).getDay());
      nearestTime.setHours(redeemStartTimeDate.getHours());
      nearestTime.setMinutes(redeemStartTimeDate.getMinutes());
      time = nearestTime.getTime();
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

  if (nft.redeem.schedule.recurring === 'daily') {
    return isTimeBetweenDailyUTC(
      moment.utc(redeemStartTime).format('HH:mm:ss'),
      moment.utc(redeemEndTime).format('HH:mm:ss'),
      moment.utc(now).format('HH:mm:ss'),
    );
  }
  if (nft.redeem.schedule.recurring === 'weekly') {
    return (
      new Date(redeemStartTime).getUTCDay() === new Date(now).getUTCDay() &&
      isTimeBetweenDailyUTC(
        moment.utc(redeemStartTime).format('HH:mm:ss'),
        moment.utc(redeemEndTime).format('HH:mm:ss'),
        moment.utc(now).format('HH:mm:ss'),
      )
    );
  }
  return redeemStartTime <= now && now <= redeemEndTime;
}

export const getRedeemEndTimeUTC = (nft: NFT) => {
  const now = moment.utc();
  const redeemStartTime = getRedeemTimeUTC(nft);
  let redeemEndTime = redeemStartTime + nft.redeem.schedule.until;

  if (
    (nft.redeem.schedule.recurring === 'daily' || nft.redeem.schedule.recurring === 'weekly') &&
    isRedeemTimeUTC(nft)
  ) {
    if (
      now >= moment.utc(moment.utc(redeemStartTime).format('HH:mm:ss'), 'HH:mm:ss') &&
      now <= moment.utc('23:59:59', 'H:mm:ss')
    ) {
      redeemEndTime += 86400000;
    }
  }

  return redeemEndTime;
};
