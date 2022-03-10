export default function getDaysInMonthUTC(month: number) {
  var date = new Date(Date.UTC(2021, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(date.getUTCDate());
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}
