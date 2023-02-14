import RNCalendarEvents, { CalendarEventWritable } from 'react-native-calendar-events';
import i18n from 'enevti-app/translations/i18n';
import nftToRedeemCalendarTitle from 'enevti-app/utils/date/nftToRedeemCalendarTitle';
import { store } from 'enevti-app/store/state';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { dateOfNearestDayUTC, getRedeemTimeUTC } from 'enevti-app/utils/date/redeemDate';

import { handleError } from '../error/handle';
import { getAppLink } from '../linking';
import { NFT } from 'enevti-types/chain/nft';

export const addCalendarEvent = async (title: string, event: CalendarEventWritable) => {
  let permissions;
  let createdEvent = '';

  try {
    permissions = await RNCalendarEvents.checkPermissions();
    if (permissions !== 'authorized') {
      permissions = await RNCalendarEvents.requestPermissions();
    }
    if (permissions !== 'authorized') {
      throw i18n.t('error:unauthorizedCalendar');
    }
    createdEvent = await RNCalendarEvents.saveEvent(title, event);
  } catch (err) {
    handleError(err);
  }

  return createdEvent;
};

export const addRedeemCalendarEvent = async (nft: NFT) => {
  const now = new Date();
  const baseTime: number = getRedeemTimeUTC(nft);

  let startTime: number = 0;
  let nextTime: string = '';
  const nftTime = { ...nft.redeem.schedule.time, ...nft.redeem.schedule.from };

  if (nft.redeem.schedule.recurring === 'anytime') {
    throw Error(i18n.t('error:invalidRecurring'));
  }

  switch (nft.redeem.schedule.recurring) {
    case 'daily':
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = getRedeemTimeUTC(nft, { date: 1 });
        nextTime = i18n.t('date:day');
      }
      break;
    case 'weekly':
      startTime = dateOfNearestDayUTC(new Date(baseTime), nftTime.day).getTime();
      if (startTime > now.getTime()) {
        nextTime = i18n.t('date:week');
      }
      break;
    case 'monthly':
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = getRedeemTimeUTC(nft, { month: 1 });
        nextTime = i18n.t('date:month');
      }
      break;
    case 'yearly':
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = getRedeemTimeUTC(nft, { year: 1 });
        nextTime = i18n.t('date:year');
      }
      break;
    case 'once':
      startTime = baseTime;
      break;
    default:
      throw new Error(i18n.t('error:unknownRecurring'));
  }

  const recurrence = nft.redeem.schedule.recurring === 'once' ? undefined : nft.redeem.schedule.recurring;

  const redeemEvent: CalendarEventWritable = {
    url: getAppLink('nft-serial-redeem', encodeURIComponent(`${nft.symbol}#${nft.serial}`)),
    description: `${getAppLink('nft-serial-redeem', encodeURIComponent(`${nft.symbol}#${nft.serial}`))}\n\n${i18n.t(
      'nftDetails:calendarDescription',
    )}`,
    notes: i18n.t('nftDetails:calendarDescription'),
    alarms: [{ date: 60 }],
    startDate: new Date(startTime).toISOString(),
    endDate: new Date(startTime + nft.redeem.schedule.until).toISOString(),
    recurrence: recurrence,
  };

  await addCalendarEvent(nftToRedeemCalendarTitle(nft), redeemEvent);

  const snackLabel = `${i18n.t('nftDetails:calendarAdded')}${
    nextTime ? ', ' + i18n.t('date:startingNext', { next: nextTime }) : ''
  }!`;

  store.dispatch(showSnackbar({ mode: 'info', text: snackLabel }));
};
