import React from 'react';
import AppMentionInput, { AppMentionInputProps } from './AppMentionInput';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';

export default function AppMenuMentionInput({ ...props }: AppMentionInputProps) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = React.useCallback(
    args => {
      shouldHandleKeyboardEvents.value = true;
      if (props.onFocus) {
        props.onFocus(args);
      }
    },
    [props, shouldHandleKeyboardEvents],
  );

  const handleOnBlur = React.useCallback(
    args => {
      shouldHandleKeyboardEvents.value = false;
      if (props.onBlur) {
        props.onBlur(args);
      }
    },
    [props, shouldHandleKeyboardEvents],
  );

  return <AppMentionInput {...props} onBlur={handleOnBlur} onFocus={handleOnFocus} />;
}
