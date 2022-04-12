export default function timezoneOffsetLabel(timezoneOffset: number) {
  return `UTC${timezoneOffset > 0 ? '' : '+'}${(timezoneOffset * -1) / 60}`;
}
