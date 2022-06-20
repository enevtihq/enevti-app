import * as Lisk from '@liskhq/lisk-client';

export function strByteLength(str: string) {
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      s++;
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2;
    }
    if (code >= 0xdc00 && code <= 0xdfff) {
      i--;
    }
  }
  return s;
}

export function stringToBuffer(str: string): Buffer {
  return Lisk.cryptography.stringToBuffer(str);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function commifyAmount(amount: string) {
  const n = parseFloat(amount);
  var parts = n.toString().split('.');
  const numberPart = parts[0];
  const decimalPart = parts[1];
  const thousands = /\B(?=(\d{3})+(?!\d))/g;
  return numberPart.replace(thousands, ',') + (decimalPart ? '.' + decimalPart : '');
}
