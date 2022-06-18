import { isValidQRAction, QRValue } from 'enevti-app/types/ui/screen/QRScanner';
import { isAppLink, isRawLink, isLinkKnown } from '../linking';

export default function parseQRValue(qrValue: string): QRValue | undefined {
  try {
    if (isAppLink(qrValue) && isRawLink(qrValue)) {
      const url = new URL(qrValue);
      const action = url.searchParams.get('action');
      const payload = url.searchParams.get('payload');
      if (action && isValidQRAction(action) && payload) {
        return { action, payload: decodeURIComponent(payload) };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }
}

export function parseQRLink(qrValue: string) {
  try {
    if (isAppLink(qrValue) && isLinkKnown(qrValue)) {
      return qrValue;
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }
}
