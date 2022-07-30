export default function timeSince(dateInMiliseconds: number) {
  let seconds = Math.floor((Date.now() - dateInMiliseconds) / 1000);
  let intervalType;

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'y';
  } else {
    interval = Math.floor(seconds / 604800);
    if (interval >= 1) {
      intervalType = 'w';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'd';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = 'h';
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = 'm';
          } else {
            interval = seconds;
            intervalType = 'now';
          }
        }
      }
    }
  }

  return (intervalType === 'now' ? '' : interval) + intervalType;
}
