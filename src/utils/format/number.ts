export function ordinalWithSuffix(i: number) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i.toString() + 'st';
  }
  if (j === 2 && k !== 12) {
    return i.toString() + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i.toString() + 'rd';
  }
  return i.toString() + 'th';
}
