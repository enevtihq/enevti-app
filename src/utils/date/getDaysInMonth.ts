export default function getDaysInMonthUTC(month: number, year: number = 2021) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(date.getUTCDate());
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}
