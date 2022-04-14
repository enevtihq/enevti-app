import RNCalendarEvents, {
  CalendarEventWritable,
} from 'react-native-calendar-events';
import i18n from 'enevti-app/translations/i18n';
import { NFT } from 'enevti-app/types/nft';
import nftToRedeemCalendarTitle from 'enevti-app/utils/date/nftToRedeemCalendarTitle';
import { store } from 'enevti-app/store/state';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

import { handleError } from '../error/handle';
import { getAppLink } from '../linking';

export function dateOfNearestDay(startingDate: Date, nearestDay: number) {
  var nearestTime = new Date(startingDate.getTime());

  if (startingDate.getDay() === 6 && nearestDay === 5) {
    nearestTime.setDate(
      startingDate.getDate() +
        ((7 + nearestDay - startingDate.getDay()) % 7) -
        7,
    );
  } else {
    nearestTime.setDate(
      startingDate.getDate() + ((7 + nearestDay - startingDate.getDay()) % 7),
    );
  }

  return nearestTime;
}

export const addCalendarEvent = async (
  title: string,
  event: CalendarEventWritable,
) => {
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
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();

  let startTime: number = 0;
  let baseTime: number = 0;
  let nextTime: string = '';
  const nftTime = { ...nft.redeem.schedule.time, ...nft.redeem.schedule.from };

  switch (nft.redeem.schedule.recurring) {
    case 'daily':
      baseTime = Date.UTC(year, month, date, nftTime.hour, nftTime.minute);
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = Date.UTC(
          year,
          month,
          date + 1,
          nftTime.hour,
          nftTime.minute,
        );
        nextTime = i18n.t('date:day');
      }
      break;
    case 'weekly':
      startTime = dateOfNearestDay(now, nftTime.day).getTime();
      if (startTime > now.getTime()) {
        nextTime = i18n.t('date:week');
      }
      break;
    case 'monthly':
      baseTime = Date.UTC(
        year,
        month,
        nftTime.date,
        nftTime.hour,
        nftTime.minute,
      );
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = Date.UTC(
          year,
          month + 1,
          nftTime.date,
          nftTime.hour,
          nftTime.minute,
        );
        nextTime = i18n.t('date:month');
      }
      break;
    case 'yearly':
      baseTime = Date.UTC(
        year,
        nftTime.month,
        nftTime.date,
        nftTime.hour,
        nftTime.minute,
      );
      if (baseTime > now.getTime()) {
        startTime = baseTime;
      } else {
        startTime = Date.UTC(
          year + 1,
          nftTime.month,
          nftTime.date,
          nftTime.hour,
          nftTime.minute,
        );
        nextTime = i18n.t('date:year');
      }
      break;
    case 'once':
      startTime = Date.UTC(
        nftTime.year,
        nftTime.month,
        nftTime.date,
        nftTime.hour,
        nftTime.minute,
      );
      break;
    default:
      throw new Error(i18n.t('error:unknownRecurring'));
  }

  const recurrence =
    nft.redeem.schedule.recurring === 'once'
      ? undefined
      : nft.redeem.schedule.recurring;

  const redeemEvent: CalendarEventWritable = {
    description: i18n.t('nftDetails:calendarDescription'),
    alarms: [{ date: 60 }],
    startDate: new Date(startTime).toISOString(),
    endDate: new Date(startTime + nft.redeem.schedule.until).toISOString(),
    location: getAppLink('nft', `${nft.symbol}#${nft.serial}`),
    recurrence: recurrence,
  };

  console.log(redeemEvent);

  await addCalendarEvent(nftToRedeemCalendarTitle(nft), redeemEvent);

  const snackLabel = `${i18n.t('nftDetails:calendarAdded')}${
    nextTime ? ', ' + i18n.t('date:startingNext', { next: nextTime }) : ''
  }!`;

  store.dispatch(
    showSnackbar({
      mode: 'info',
      text: snackLabel,
    }),
  );
};
