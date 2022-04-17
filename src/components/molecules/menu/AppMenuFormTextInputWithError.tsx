import React from 'react';
import { shallowEqual } from 'react-redux';
import AppFormTextInputWithError, {
  AppFormTextInputWithErrorProps,
} from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { ModalContext } from 'enevti-app/context';

function AppMenuFormTextInputWithError(
  props: AppFormTextInputWithErrorProps,
  ref: any,
) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const withModal = React.useContext(ModalContext);

  const onFocus = React.useCallback(
    e => {
      withModal ? (shouldHandleKeyboardEvents.value = true) : {};
      props.onFocus && props.onFocus(e);
    },
    [props, shouldHandleKeyboardEvents, withModal],
  );

  const onBlur = React.useCallback(
    e => {
      withModal ? (shouldHandleKeyboardEvents.value = false) : {};
      props.onBlur && props.onBlur(e);
    },
    [props, shouldHandleKeyboardEvents, withModal],
  );

  return (
    <AppFormTextInputWithError
      {...props}
      ref={ref}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}

const forwardedAppMenuFormTextInputWithError = React.forwardRef(
  AppMenuFormTextInputWithError,
);

const memoizedAppFormTextInputWithError = React.memo(
  forwardedAppMenuFormTextInputWithError,
  (prevProps, nextProps) => {
    if (prevProps.memoKey) {
      let ret = true;
      prevProps.memoKey.forEach(key => {
        if (prevProps[key] !== nextProps[key]) {
          ret = false;
        }
      });
      return ret;
    } else {
      return shallowEqual(prevProps, nextProps);
    }
  },
);

export default memoizedAppFormTextInputWithError;
