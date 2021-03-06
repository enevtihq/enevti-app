import Color from 'color';
import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';

import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppSecondaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppSecondaryButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}: AppSecondaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  return loading ? (
    <View style={[styles.secondaryButton, style]}>
      <AppActivityIndicator animating={true} style={styles.loading} color={theme.colors.text} />
    </View>
  ) : (
    <Button
      disabled={disabled}
      mode="text"
      color={theme.dark ? 'white' : 'black'}
      icon={icon}
      onPress={onPress}
      uppercase={false}
      contentStyle={[styles.content, style]}
      style={[styles.secondaryButton, style]}>
      {children}
    </Button>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    secondaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%', insets),
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.6).rgb().toString()
        : Color(theme.colors.background).darken(0.12).rgb().toString(),
    },
    content: {
      height: hp('7.5%', insets),
    },
    loading: {
      height: hp('7.5%', insets),
      justifyContent: 'center',
    },
  });
