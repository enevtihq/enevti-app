import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper/src/core/theming';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Theme } from '../../../theme/default';

interface AppTertiaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function AppTertiaryButton({
  children,
  onPress,
  disabled = false,
  icon,
  style,
}: AppTertiaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = makeStyles(theme);

  return (
    <Button
      disabled={disabled}
      mode="outlined"
      color={theme.dark ? 'white' : 'black'}
      icon={icon}
      onPress={onPress}
      uppercase={false}
      contentStyle={styles.content}
      style={[styles.tertiaryButton, style]}>
      {children}
    </Button>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    tertiaryButton: {
      borderRadius: theme.roundness,
      height: hp('7.5%'),
    },
    content: {
      height: hp('7.5%'),
    },
  });
