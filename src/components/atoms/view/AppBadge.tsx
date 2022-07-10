import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';

export default function AppBadge() {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return <View style={styles.container} />;
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignSelf: 'flex-end',
      borderRadius: 12,
      height: 12,
      width: 12,
      backgroundColor: theme.colors.notification,
    },
  });
