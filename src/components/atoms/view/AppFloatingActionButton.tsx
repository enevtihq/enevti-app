import { StyleSheet } from 'react-native';
import React from 'react';
import { FAB, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';

export default function AppFloatingActionButton() {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);

  return (
    <FAB
      style={styles.fab}
      animated
      label={'Add Stake'}
      icon="plus"
      onPress={() => console.log('Pressed')}
    />
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });
