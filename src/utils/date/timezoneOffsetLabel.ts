export default function timezoneOffsetLabel(timezoneOffset?: number) {
  const offset = timezoneOffset ?? new Date().getTimezoneOffset();
  return `UTC${offset > 0 ? '' : '+'}${(offset * -1) / 60}`;
}
