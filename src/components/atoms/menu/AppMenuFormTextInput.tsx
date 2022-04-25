import React from 'react';
import AppFormTextInput, {
  AppFormTextInputProps,
} from 'enevti-app/components/atoms/form/AppFormTextInput';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { ModalContext } from 'enevti-app/context';

export function AppMenuFormTextInput(props: AppFormTextInputProps, ref: any) {
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

  return <AppFormTextInput {...props} ref={ref} onBlur={onBlur} onFocus={onFocus} />;
}

const forwardedAppMenuFormTextInput = React.forwardRef(AppMenuFormTextInput);

const memoizedAppMenuFormTextInput = React.memo(forwardedAppMenuFormTextInput);

export default memoizedAppMenuFormTextInput;
