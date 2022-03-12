export function fileSizeKMG(num: number, decimal?: number): string {
  if (num < 1000) {
    return decimal
      ? num.toFixed(decimal).toString() + ' bytes'
      : num.toString() + ' bytes';
  } else if (num > 999 && num < 1000000) {
    return decimal
      ? (num / 1000).toFixed(decimal).toString() + ' KB'
      : (num / 1000).toString() + ' KB';
  } else if (num > 999999 && num < 1000000000) {
    return decimal
      ? (num / 1000000).toFixed(decimal).toString() + ' MB'
      : (num / 1000000).toString() + ' MB';
  } else if (num > 999999999) {
    return decimal
      ? (num / 1000000000).toFixed(decimal).toString() + ' GB'
      : (num / 1000000000).toString() + ' GB';
  } else {
    return 'unknown';
  }
}
