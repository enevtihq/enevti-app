import React from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState } from 'enevti-app/store/slices/auth';
import {
  selectDisplayState,
  setDisplayMaximized,
  setDisplayMinimized,
  setDisplayScreenState,
} from 'enevti-app/store/slices/ui/screen/display';
import {
  resetLastScreenActive,
  selectLastActiveState,
  setLastScreenActive,
} from 'enevti-app/store/slices/ui/screen/lastActive';
import { lockScreen } from 'enevti-app/store/slices/ui/screen/locked';
import { lastFetchTimeout } from 'enevti-app/utils/constant/lastFetch';
import { resetLocalSessionKey } from 'enevti-app/store/slices/session/local';

export default function useScreenDisplayed() {
  const dispatch = useDispatch();
  const display = useSelector(selectDisplayState);
  const lastActive = useSelector(selectLastActiveState);
  const auth = useSelector(selectAuthState);

  const handleChange = React.useCallback(
    (nextState: string) => {
      if (!display.maximized && nextState === 'active') {
        dispatch(setDisplayMaximized());
        if (auth.type && Date.now() - lastActive > lastFetchTimeout.display) {
          dispatch(lockScreen());
          dispatch(resetLocalSessionKey());
        }
        dispatch(resetLastScreenActive());
      } else if (display.maximized && nextState !== 'active') {
        dispatch(setDisplayMinimized());
        dispatch(setLastScreenActive(Date.now()));
      }
      dispatch(setDisplayScreenState(nextState));
    },
    [dispatch, display, lastActive, auth.type],
  );

  React.useEffect(() => {
    const listener = AppState.addEventListener('change', handleChange);
    return function cleanup() {
      listener.remove();
    };
  }, [handleChange]);
}
