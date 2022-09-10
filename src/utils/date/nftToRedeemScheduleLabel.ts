import i18n from 'enevti-app/translations/i18n';
import { fileSizeKMG } from 'enevti-app/utils/format/fileSize';
import recurringToLabel from 'enevti-app/utils/date/recurringToLabel';
import timezoneOffsetLabel from 'enevti-app/utils/date/timezoneOffsetLabel';
import { dateToHourMinuteString, dayToString, monthToString } from 'enevti-app/utils/date/dateToString';
import { ordinalWithSuffix } from '../format/number';
import { getRedeemTimeUTC } from './redeemDate';
import { NFT } from 'enevti-app/types/core/chain/nft';

export default function nftToRedeemScheduleLabel(nft: NFT) {
  let ret: string = '';
  let timeString: string = '';

  if (nft.utility === 'content') {
    ret = i18n.t('nftDetails:contentCalendarLabel', {
      status: nft.redeem.status,
      extension: nft.redeem.content.extension,
      mime: nft.redeem.content.mime,
      size: fileSizeKMG(nft.redeem.content.size, 2),
    });
  } else {
    if (nft.redeem.schedule.recurring === 'anytime') {
      throw Error(i18n.t('error:invalidRecurring'));
    }

    const separator = ' · ';
    const time: number = getRedeemTimeUTC(nft);
    const startTime: Date = new Date(time);
    const endTime: Date = new Date(time + nft.redeem.schedule.until);

    ret +=
      (nft.redeem.schedule.recurring === 'once' ? `${i18n.t('nftDetails:redeem')} ` : '') +
      recurringToLabel(nft.redeem.schedule.recurring);

    switch (nft.redeem.schedule.recurring) {
      case 'daily':
        break;
      case 'weekly':
        timeString = dayToString(startTime.getDay()) + separator;
        break;
      case 'monthly':
        timeString =
          i18n.t('nftDetails:onTheDate', {
            date: ordinalWithSuffix(startTime.getDate()),
          }) + separator;
        break;
      case 'yearly':
        timeString = `${monthToString(startTime.getMonth())!}, ${ordinalWithSuffix(startTime.getDate())}${separator}`;
        break;
      case 'once':
        timeString = `${monthToString(startTime.getMonth())!}, ${ordinalWithSuffix(
          startTime.getDate(),
        )} ${startTime.getFullYear()}${separator}`;
        break;
      default:
        break;
    }

    ret =
      ret +
      separator +
      timeString +
      `${dateToHourMinuteString(startTime)} - ${dateToHourMinuteString(endTime)} ${timezoneOffsetLabel()}`;

    if (nft.redeem.schedule.recurring === 'once') {
      ret =
        ret +
        separator +
        (nft.redeem.status !== 'limit-exceeded'
          ? i18n.t('nftDetails:redeemAvailable')
          : i18n.t('nftDetails:alreadyRedeemed'));
    } else {
      ret =
        ret +
        separator +
        (nft.redeem.status !== 'limit-exceeded'
          ? nft.redeem.limit === 0
            ? i18n.t('nftDetails:noRedeemLimit')
            : i18n.t('nftDetails:redeemRemaining', {
                count: nft.redeem.limit - nft.redeem.count,
              })
          : i18n.t('nftDetails:limitExceeded'));
    }
  }
  return ret;
}
