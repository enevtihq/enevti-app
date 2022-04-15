import BigNumber from 'bignumber.js';
import i18n from 'enevti-app/translations/i18n';

export function basicTokenUnit(amount: string): string {
  return new BigNumber(amount).div(100000000).toString();
}

export function completeTokenUnit(amount: string | number): string {
  return new BigNumber(amount).times(100000000).toString();
}

export function parseAmount(
  amount: string,
  kmb = false,
  decimal?: number,
): string {
  const num = new BigNumber(basicTokenUnit(amount));

  if (kmb) {
    return bigNumberKMB(num, decimal);
  } else {
    return decimal ? num.decimalPlaces(decimal).toString() : num.toString();
  }
}

export function bigNumberKMB(num: BigNumber, decimal?: number): string {
  if (num.isLessThan(1000)) {
    return decimal ? num.decimalPlaces(decimal).toString() : num.toString();
  } else if (num.isGreaterThan(999) && num.isLessThan(1000000)) {
    return decimal
      ? num.div(1000).decimalPlaces(decimal).toString() + 'K'
      : num.div(1000).toString() + 'K';
  } else if (num.isGreaterThan(999999) && num.isLessThan(1000000000)) {
    return decimal
      ? num.div(1000000).decimalPlaces(decimal).toString() + 'M'
      : num.div(1000000).toString() + 'M';
  } else if (num.isGreaterThan(999999999)) {
    return decimal
      ? num.div(1000000000).decimalPlaces(decimal).toString() + 'B'
      : num.div(1000000000).toString() + 'B';
  } else {
    return i18n.t('error:unknown');
  }
}

export function numberKMB(num: number, decimal?: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num > 999 && num < 1000000) {
    return decimal
      ? (num / 1000).toFixed(decimal).toString() + 'K'
      : (num / 1000).toString() + 'K';
  } else if (num > 999999 && num < 1000000000) {
    return decimal
      ? (num / 1000000).toFixed(decimal).toString() + 'M'
      : (num / 1000000).toString() + 'M';
  } else if (num > 999999999) {
    return decimal
      ? (num / 1000000000).toFixed(decimal).toString() + 'B'
      : (num / 1000000000).toString() + 'B';
  } else {
    return i18n.t('error:unknown');
  }
}
