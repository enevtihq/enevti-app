import React from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDisplayState,
  setDisplayMaximized,
  setDisplayMinimized,
  setDisplayScreenState,
} from '../../store/slices/ui/screen/display';
import {
  resetLastScreenActive,
  selectLastActiveState,
  setLastScreenActive,
} from '../../store/slices/ui/screen/lastActive';
import { lockScreen } from '../../store/slices/ui/screen/locked';
import { lastFetchTreshold } from '../constant/lastFetch';

export default function useScreenDisplayed() {
  const dispatch = useDispatch();
  const display = useSelector(selectDisplayState);
  const lastActive = useSelector(selectLastActiveState);

  const handleChange = React.useCallback(
    (nextState: string) => {
      if (!display.maximized && nextState === 'active') {
        dispatch(setDisplayMaximized());
        if (Date.now() - lastActive > lastFetchTreshold.display) {
          dispatch(lockScreen());
        }
        dispatch(resetLastScreenActive());
      } else if (display.maximized && nextState !== 'active') {
        dispatch(setDisplayMinimized());
        dispatch(setLastScreenActive(Date.now()));
      }
      dispatch(setDisplayScreenState(nextState));
    },
    [dispatch, display, lastActive],
  );

  React.useEffect(() => {
    const listener = AppState.addEventListener('change', handleChange);
    return function cleanup() {
      listener.remove();
    };
  }, [handleChange]);
}
