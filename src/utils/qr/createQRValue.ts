import { QRAction } from 'enevti-app/types/ui/screen/QRScanner';
import { AppLinkNamespace, APP_LINK, getAppLink } from '../linking';

export default function createQRValue(action: QRAction, payload: string): string {
  const url = getAppLink('', `?action=${action}&payload=${encodeURIComponent(payload)}`);
  return url;
}

export function createQRLink(namespace: AppLinkNamespace, arg: string): string {
  const url = getAppLink(namespace, arg, APP_LINK);
  return url;
}
