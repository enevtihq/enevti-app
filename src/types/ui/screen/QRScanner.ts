export const KNOWN_QR_ACTION = ['qrmint'];
export type QRAction = typeof KNOWN_QR_ACTION[number];
export type QRValue = { action: QRAction; payload: string };

export function isValidQRAction(action: string) {
  return KNOWN_QR_ACTION.includes(action);
}
