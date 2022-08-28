declare module 'rn-android-overlay-permission' {
  export const isRequestOverlayPermissionGranted: (callback: (status: any) => void) => void;
  export const requestOverlayPermission: () => void;
}
