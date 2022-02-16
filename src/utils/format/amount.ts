import BigNumber from 'bignumber.js';

export function basicTokenUnit(amount: string): string {
  return new BigNumber(amount).div(100000000).toString();
}

export function parseAmount(amount: string, kmb = false): string {
  const num = new BigNumber(basicTokenUnit(amount));

  if (kmb) {
    if (num.isLessThan(1000)) {
      return num.decimalPlaces(2).toString();
    } else if (num.isGreaterThan(999) && num.isLessThan(1000000)) {
      return num.div(1000).decimalPlaces(2).toString() + 'K';
    } else if (num.isGreaterThan(999999) && num.isLessThan(1000000000)) {
      return num.div(1000000).decimalPlaces(2).toString() + 'M';
    } else if (num.isGreaterThan(999999999)) {
      return num.div(1000000000).decimalPlaces(2).toString() + 'B';
    } else {
      return 'unknown';
    }
  } else {
    return num.toString();
  }
}
