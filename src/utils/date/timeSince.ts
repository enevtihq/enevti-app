import i18n from 'enevti-app/translations/i18n';

export default function timeSince(dateInMiliseconds: number) {
  let seconds = Math.floor((Date.now() - dateInMiliseconds) / 1000);
  let intervalType;

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = i18n.t('date:yearLetter');
  } else {
    interval = Math.floor(seconds / 604800);
    if (interval >= 1) {
      intervalType = i18n.t('date:weekLetter');
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = i18n.t('date:dayLetter');
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = i18n.t('date:hourLetter');
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = i18n.t('date:minuteLetter');
          } else {
            interval = seconds;
            intervalType = i18n.t('date:nowLetter');
          }
        }
      }
    }
  }

  return (intervalType === 'now' ? '' : interval) + intervalType;
}
