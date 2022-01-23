import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { SnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useTheme } from 'react-native-paper/src/core/theming';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';

interface AppSnackbarProps extends Omit<SnackbarProps, 'theme'> {
  mode?: 'info' | 'error';
}

export default function AppSnackBar({
  mode = 'info',
  ...props
}: AppSnackbarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);

  if (mode === 'info') {
    return (
      <Snackbar
        {...props}
        style={[props.style, styles.errorSnack]}
        theme={theme}
      />
    );
  } else if (mode === 'error') {
    return (
      <Snackbar
        {...props}
        style={[
          props.style,
          styles.errorSnack,
          { backgroundColor: theme.colors.error },
        ]}
        theme={theme}
      />
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
