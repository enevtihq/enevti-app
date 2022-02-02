import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
} from 'react-native';
import React from 'react';

interface AppKeyboardDismissOnClickViewProps {
  children: React.ReactNode;
  activate: boolean;
}

export default function AppKeyboardDismissOnClickView({
  children,
  activate,
}: AppKeyboardDismissOnClickViewProps): JSX.Element {
  const styles = makeStyles();

  return activate ? (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}>
      <View style={styles.view}>{children}</View>
    </TouchableWithoutFeedback>
  ) : (
    (children as JSX.Element)
  );
}

const makeStyles = () =>
  StyleSheet.create({
    view: {
      flex: 1,
    },
  });
