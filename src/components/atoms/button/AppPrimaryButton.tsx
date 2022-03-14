import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

import { Theme } from '../../../theme/default';
import { hp, SafeAreaInsets } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppActivityIndicator from '../loading/AppActivityIndicator';

interface AppPrimaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppPrimaryButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}: AppPrimaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const primary = disabled
    ? Color('black').alpha(0.5).rgb().string()
    : theme.colors.primary;
  const secondary = disabled
    ? Color('black').alpha(0.5).rgb().string()
    : theme.colors.secondary;

  return (
    <LinearGradient
      colors={[primary, secondary]}
      style={[styles.primaryButton, style]}>
      {loading ? (
        <AppActivityIndicator
          animating={true}
          style={styles.content}
          color="white"
        />
      ) : (
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
      )}
    </LinearGradient>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    primaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%', insets),
    },
    content: {
      height: hp('7.5%', insets),
    },
  });
