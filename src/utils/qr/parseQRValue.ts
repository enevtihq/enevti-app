import { QRValue } from 'enevti-app/types/ui/screen/QRScanner';

export default function parseQRValue(qrValue: string): QRValue {
  return JSON.parse(qrValue) as QRValue;
}
