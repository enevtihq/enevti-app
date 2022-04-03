import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import Color from 'color';

import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppTertiaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppTertiaryButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
}: AppTertiaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );

  return loading ? (
    <View style={[styles.tertiaryLoading, styles.tertiaryButton, style]}>
      <AppActivityIndicator
        animating={true}
        style={styles.content}
        color={theme.colors.text}
      />
    </View>
  ) : (
    <Button
      disabled={disabled}
      mode="outlined"
      color={theme.dark ? 'white' : 'black'}
      icon={icon}
      onPress={onPress}
      uppercase={false}
      contentStyle={[styles.content, style]}
      style={[styles.tertiaryButton, style]}>
      {children}
    </Button>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    tertiaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%', insets),
    },
    tertiaryLoading: {
      borderStyle: 'solid',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.dark ? 'white' : 'black')
        .alpha(0.29)
        .rgb()
        .string(),
    },
    content: {
      height: hp('7.5%', insets),
    },
  });
