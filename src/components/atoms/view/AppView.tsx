import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

interface AppViewProps {
  children: React.ReactNode;
}

export default function AppView({ children }: AppViewProps) {
  return (
    <View style={styles.view}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
