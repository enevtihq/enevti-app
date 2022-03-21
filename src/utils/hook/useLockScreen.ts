import React from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  lockScreen,
  selectLockedState,
} from '../../store/slices/ui/screen/locked';

export default function useLockScreen() {
  const dispatch = useDispatch();
  const locked = useSelector(selectLockedState);

  React.useEffect(() => {
    const { RNLockDetection } = NativeModules;
    RNLockDetection.registerDeviceLockListener();
    const LockDetectionEmitter = new NativeEventEmitter(RNLockDetection);
    const lockDetectionSuscription = LockDetectionEmitter.addListener(
      'LockStatusChange',
      ({ status }) => {
        if (!locked && status === 'LOCKED') {
          dispatch(lockScreen());
        }
      },
    );
    return function cleanup() {
      lockDetectionSuscription.remove();
    };
  }, [dispatch, locked]);
}
