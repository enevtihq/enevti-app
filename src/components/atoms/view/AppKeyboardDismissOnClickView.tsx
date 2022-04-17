import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
} from 'react-native';
import React from 'react';

interface AppKeyboardDismissOnClickViewProps {
  children: React.ReactNode;
  activate?: boolean;
}

export default function AppKeyboardDismissOnClickView({
  children,
  activate = true,
}: AppKeyboardDismissOnClickViewProps): JSX.Element {
  const styles = React.useMemo(() => makeStyles(), []);
  return activate ? (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}>
      <View style={styles.childView}>{children}</View>
    </TouchableWithoutFeedback>
  ) : (
    (children as JSX.Element)
  );
}

const makeStyles = () =>
  StyleSheet.create({
    childView: {
      flex: 1,
    },
  });
