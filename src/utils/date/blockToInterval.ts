import i18n from 'enevti-app/translations/i18n';

function msToTime(s: number) {
  let ret = '';
  let time = s;
  const ms = time % 1000;
  time = (time - ms) / 1000;
  const secs = time % 60;
  time = (time - secs) / 60;
  const mins = time % 60;
  time = (time - mins) / 60;
  const hrs = time % 24;
  time = (time - hrs) / 24;
  const days = time % 7;
  time = (time - days) / 7;
  const week = time % 4;
  time = (time - week) / 4;
  const month = time % 12;
  const year = (time - month) / 12;

  if (year > 0) {
    ret += `${year.toString()} ${i18n.t('date:year')}`;
  }

  if (month > 0) {
    if (year > 0) {
      ret += ', ';
    }
    ret += `${month.toString()} ${i18n.t('date:month')}`;
  }

  if (week > 0) {
    if (month > 0) {
      ret += ', ';
    }
    ret += `${week.toString()} ${i18n.t('date:week')}`;
  }

  if (days > 0) {
    if (week > 0) {
      ret += ', ';
    }
    ret += `${days.toString()} ${i18n.t('date:day')}`;
  }

  if (hrs > 0) {
    ret += `${hrs.toString()} ${i18n.t('date:hour')}`;
  }

  if (mins > 0) {
    if (hrs > 0) {
      ret += ', ';
    }
    ret += `${mins.toString()} ${i18n.t('date:minute')}`;
  }

  if (secs > 0) {
    if (mins > 0) {
      ret += ', ';
    }
    ret += `${secs.toString()} ${i18n.t('date:second')}`;
  }

  return ret;
}

export default function blockToInterval(blockTime: number) {
  return msToTime(blockTime);
}
