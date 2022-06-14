type QRAction = 'qrmint';
type QRValue = { action: QRAction; payload: string };

export default function createQRValue(action: QRAction, payload: string): string {
  const value: QRValue = { action, payload };
  return JSON.stringify(value);
}
