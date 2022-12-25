import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { SnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar';
import { useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';

interface AppSnackbarProps extends Omit<SnackbarProps, 'theme'> {
  mode?: 'info' | 'error';
}

export default function AppSnackBar({ mode = 'info', ...props }: AppSnackbarProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);

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

const makeStyles = () =>
  StyleSheet.create({
    errorSnack: {
      marginVertical: hp('10%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
