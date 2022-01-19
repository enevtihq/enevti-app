import color from 'color';
import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper/src/core/theming';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Theme } from '../../../theme/default';

interface AppSecondaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppSecondaryButton({
  children,
  onPress,
  disabled = false,
  icon,
  style,
}: AppSecondaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = makeStyles(theme);

  return (
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    secondaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%'),
      backgroundColor: theme.dark
        ? color(theme.colors.background).lighten(0.6).rgb().toString()
        : color(theme.colors.background).darken(0.12).rgb().toString(),
    },
    content: {
      height: hp('7.5%'),
    },
  });
