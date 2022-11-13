import React from 'react';
import AppFormSecureTextInput, {
  AppFormSecureTextInputProps,
} from 'enevti-app/components/organism/form/AppFormSecureTextInput';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { ModalContext } from 'enevti-app/context';

function AppMenuFormSecureTextInput(props: AppFormSecureTextInputProps, ref: any) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const withModal = React.useContext(ModalContext);

  const onFocus = React.useCallback(
    e => {
      withModal ? (shouldHandleKeyboardEvents.value = true) : {};
      props.onFocus && props.onFocus(e);
    },
    [props, shouldHandleKeyboardEvents, withModal],
  );

  const touchHandler = React.useCallback(() => {
    withModal ? (shouldHandleKeyboardEvents.value = false) : {};
    props.touchHandler && props.touchHandler();
  }, [props, shouldHandleKeyboardEvents, withModal]);

  return <AppFormSecureTextInput {...props} ref={ref} touchHandler={touchHandler} onFocus={onFocus} />;
}

const forwardedAppMenuFormSecureTextInput = React.forwardRef(AppMenuFormSecureTextInput);
export default forwardedAppMenuFormSecureTextInput;
