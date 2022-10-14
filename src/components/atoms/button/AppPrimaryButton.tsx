import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

import { Theme } from 'enevti-app/theme/default';
import { hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppPrimaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
}

export default function AppPrimaryButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
  theme,
}: AppPrimaryButtonProps): JSX.Element {
  const paperTheme = useTheme() as Theme;
  const buttonTheme = theme ?? paperTheme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(buttonTheme, insets), [buttonTheme, insets]);
  const primary = disabled ? Color('black').alpha(0.5).rgb().string() : buttonTheme.colors.primary;
  const secondary = disabled ? Color('black').alpha(0.5).rgb().string() : buttonTheme.colors.secondary;

  return (
    <LinearGradient colors={[primary, secondary]} style={[styles.primaryButton, style]}>
      {loading ? (
        <AppActivityIndicator animating={true} style={styles.loading} color="white" />
      ) : (
        <Button
          theme={buttonTheme as any}
          disabled={disabled}
          mode="text"
          onPress={onPress}
          color="white"
          icon={icon}
          uppercase={false}
          contentStyle={[styles.content, style]}>
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
    loading: {
      height: hp('7.5%', insets),
      justifyContent: 'center',
    },
    content: {
      height: hp('7.5%', insets),
    },
  });
