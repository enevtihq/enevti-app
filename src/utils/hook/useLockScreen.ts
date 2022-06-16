import React from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState } from 'enevti-app/store/slices/auth';
import { lockScreen, selectLockedState } from 'enevti-app/store/slices/ui/screen/locked';
import { resetLocalSessionKey } from 'enevti-app/store/slices/session/local';

export default function useLockScreen() {
  const dispatch = useDispatch();
  const locked = useSelector(selectLockedState);
  const auth = useSelector(selectAuthState);

  React.useEffect(() => {
    const { RNLockDetection } = NativeModules;
    RNLockDetection.registerDeviceLockListener();
    const LockDetectionEmitter = new NativeEventEmitter(RNLockDetection);
    const lockDetectionSuscription = LockDetectionEmitter.addListener('LockStatusChange', ({ status }) => {
      if (!locked && auth.type && status === 'LOCKED') {
        dispatch(lockScreen());
        dispatch(resetLocalSessionKey());
      }
    });
    return function cleanup() {
      lockDetectionSuscription.remove();
    };
  }, [dispatch, locked, auth.type]);
}
