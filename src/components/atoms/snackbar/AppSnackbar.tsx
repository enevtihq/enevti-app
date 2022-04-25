import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { SnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';

interface AppSnackbarProps extends Omit<SnackbarProps, 'theme'> {
  mode?: 'info' | 'error';
}

export default function AppSnackBar({ mode = 'info', ...props }: AppSnackbarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  if (mode === 'info') {
    return (
      <Portal>
        <Snackbar {...props} style={[props.style, styles.errorSnack]} theme={theme}>
          {props.children}
        </Snackbar>
      </Portal>
    );
  } else if (mode === 'error') {
    return (
      <Portal>
        <Snackbar
          {...props}
          style={[props.style, styles.errorSnack, { backgroundColor: theme.colors.error }]}
          theme={theme}>
          {props.children}
        </Snackbar>
      </Portal>
    );
  } else {
    return <View />;
  }
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    errorSnack: {
      marginVertical: hp('10%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
