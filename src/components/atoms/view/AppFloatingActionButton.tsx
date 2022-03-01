import { StyleSheet } from 'react-native';
import React from 'react';
import { AnimatedFAB, useTheme } from 'react-native-paper';

interface AppFloatingActionButtonProps {
  extended?: boolean;
}

export default function AppFloatingActionButton({
  extended = true,
}: AppFloatingActionButtonProps) {
  const theme = useTheme();
  theme.colors.accent = theme.colors.primary;
  const styles = makeStyle();

  return (
    <AnimatedFAB
      extended={extended}
      theme={theme}
      style={styles.fab}
      uppercase={false}
      label={'Add Stake'}
      icon="plus"
      onPress={() => console.log('Pressed')}
    />
  );
}

const makeStyle = () =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: 16,
      zIndex: 99,
    },
  });
