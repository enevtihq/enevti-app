import BigNumber from 'bignumber.js';
import i18n from 'enevti-app/translations/i18n';
import { commifyAmount } from '../primitive/string';

export function basicTokenUnit(amount: string): string {
  return new BigNumber(amount).div(100000000).toString();
}

export function completeTokenUnit(amount: string | number): string {
  return new BigNumber(amount).times(100000000).toString();
}

export function parseAmount(amount: string, kmb = false, decimal?: number): string {
  const num = new BigNumber(basicTokenUnit(amount));

  if (kmb) {
    return bigNumberKMB(num, decimal);
  } else {
    return decimal ? num.decimalPlaces(decimal, BigNumber.ROUND_DOWN).toString() : num.toString();
  }
}

export function bigNumberKMB(num: BigNumber, decimal?: number): string {
  if (num.isLessThan(1000)) {
    return decimal ? num.decimalPlaces(decimal).toString() : num.toString();
  } else if (num.isGreaterThan(999) && num.isLessThan(1000000)) {
    return decimal
      ? num.div(1000).decimalPlaces(decimal, BigNumber.ROUND_DOWN).toString() + 'K'
      : num.div(1000).toString() + 'K';
  } else if (num.isGreaterThan(999999) && num.isLessThan(1000000000)) {
    return decimal
      ? num.div(1000000).decimalPlaces(decimal, BigNumber.ROUND_DOWN).toString() + 'M'
      : num.div(1000000).toString() + 'M';
  } else if (num.isGreaterThan(999999999)) {
    return decimal
      ? num.div(1000000000).decimalPlaces(decimal, BigNumber.ROUND_DOWN).toString() + 'B'
      : num.div(1000000000).toString() + 'B';
  } else {
    return i18n.t('error:unknown');
  }
}

// export function numberKMB(
//   num: number,
//   decimal?: number,
//   comify?: boolean,
//   include: ('K' | 'M' | 'B')[] = ['K', 'M', 'B'],
//   lowerBound: number = 1000,
// ): string {
//   let baseNum = num;
//   let kmb = '';
//   if (num < lowerBound) {
//   } else if (num > 999 && num < 1000000 && include.includes('K')) {
//     return decimal ? (num / 1000).toFixed(decimal).toString() + 'K' : (num / 1000).toString() + 'K';
//   } else if (num > 999999 && num < 1000000000 && include.includes('M')) {
//     return decimal ? (num / 1000000).toFixed(decimal).toString() + 'M' : (num / 1000000).toString() + 'M';
//   } else if (num > 999999999 && include.includes('B')) {
//     return decimal ? (num / 1000000000).toFixed(decimal).toString() + 'B' : (num / 1000000000).toString() + 'B';
//   } else {
//     return num.toString();
//   }
// }

export function numberKMB(
  num: number,
  decimal?: number,
  comify?: boolean,
  include: ('K' | 'M' | 'B')[] = ['K', 'M', 'B'],
  lowerBound: number = 1000,
): string {
  let baseNum = num;
  let kmb = '';
  let ret = '';

  if (num > lowerBound) {
    if (num > 999 && num < 1000000 && include.includes('K')) {
      baseNum = num / 1000;
      kmb = 'K';
    } else if (num > 999999 && num < 1000000000 && include.includes('M')) {
      baseNum = num / 1000000;
      kmb = 'M';
    } else if (num > 999999999 && include.includes('B')) {
      baseNum = num / 1000000000;
      kmb = 'B';
    }
    if (decimal) {
      ret = baseNum.toFixed(decimal);
    }
  } else {
    ret = baseNum.toString();
  }

  if (comify) {
    ret = commifyAmount(ret);
  }
  ret += kmb;

  return ret;
}
