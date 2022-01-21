import color from 'color';
import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper/src/core/theming';
import { hp, SafeAreaInsets } from '../../../utils/imageRatio';

import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppSecondaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
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
  const styles = makeStyles(theme, insets);

  return loading ? (
    <View style={[styles.secondaryButton, style]}>
      <ActivityIndicator
        animating={true}
        style={styles.content}
        color={theme.colors.text}
      />
    </View>
  ) : (
    <Button
      disabled={disabled}
      mode="text"
      color={theme.dark ? 'white' : 'black'}
      icon={icon}
      onPress={onPress}
      uppercase={false}
      contentStyle={styles.content}
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
        ? color(theme.colors.background).lighten(0.6).rgb().toString()
        : color(theme.colors.background).darken(0.12).rgb().toString(),
    },
    content: {
      height: hp('7.5%', insets),
    },
  });
