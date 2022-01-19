import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper/src/core/theming';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import color from 'color';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

import { Theme } from '../../../theme/default';

interface AppPrimaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppPrimaryButton({
  children,
  onPress,
  disabled = false,
  icon,
  style,
}: AppPrimaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = makeStyles(theme);
  const primary = disabled
    ? color('black').alpha(0.5).rgb().string()
    : theme.colors.primary;
  const secondary = disabled
    ? color('black').alpha(0.5).rgb().string()
    : theme.colors.secondary;

  return (
    <LinearGradient
      colors={[primary, secondary]}
      style={[styles.primaryButton, style]}>
      <Button
        disabled={disabled}
        mode="text"
        onPress={onPress}
        color="white"
        icon={icon}
        uppercase={false}
        contentStyle={styles.content}>
        {children}
      </Button>
    </LinearGradient>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    primaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%'),
    },
    content: {
      height: hp('7.5%'),
    },
  });
