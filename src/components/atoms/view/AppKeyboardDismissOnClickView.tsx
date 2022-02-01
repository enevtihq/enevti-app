import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';

interface AppKeyboardDismissOnClickViewProps {
  children: React.ReactNode;
  activate: boolean;
}

export default function AppKeyboardDismissOnClickView({
  children,
  activate,
}: AppKeyboardDismissOnClickViewProps): JSX.Element {
  return activate ? (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  ) : (
    (children as JSX.Element)
  );
}
