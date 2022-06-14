import { QRAction, QRValue } from 'enevti-app/types/ui/screen/QRScanner';

export default function createQRValue(action: QRAction, payload: string): string {
  const value: QRValue = { action, payload };
  return JSON.stringify(value);
}
