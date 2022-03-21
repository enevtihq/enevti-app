import React from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

export default function useLockScreen() {
  React.useEffect(() => {
    const { RNLockDetection } = NativeModules;
    RNLockDetection.registerDeviceLockListener();
    const LockDetectionEmitter = new NativeEventEmitter(RNLockDetection);
    const lockDetectionSuscription = LockDetectionEmitter.addListener(
      'LockStatusChange',
      ({ status }) => {
        console.log(status);
        // TODO: if locked && state is not locked, then fire onLocked
      },
    );
    return function cleanup() {
      lockDetectionSuscription.remove();
    };
  }, []);
}
