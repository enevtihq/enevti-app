import BigNumber from 'bignumber.js';

export function basicTokenUnit(amount: string): string {
  return new BigNumber(amount).div(100000000).toString();
}

export function parseAmount(
  amount: string,
  kmb = false,
  decimal?: number,
): string {
  const num = new BigNumber(basicTokenUnit(amount));

  if (kmb) {
    if (num.isLessThan(1000)) {
      return decimal ? num.decimalPlaces(decimal).toString() : num.toString();
    } else if (num.isGreaterThan(999) && num.isLessThan(1000000)) {
      return decimal
        ? num.div(1000).decimalPlaces(decimal).toString() + 'K'
        : num.toString() + 'K';
    } else if (num.isGreaterThan(999999) && num.isLessThan(1000000000)) {
      return decimal
        ? num.div(1000000).decimalPlaces(decimal).toString() + 'M'
        : num.toString() + 'M';
    } else if (num.isGreaterThan(999999999)) {
      return decimal
        ? num.div(1000000000).decimalPlaces(decimal).toString() + 'B'
        : num.toString() + 'B';
    } else {
      return 'unknown';
    }
  } else {
    return decimal ? num.decimalPlaces(decimal).toString() : num.toString();
  }
}
