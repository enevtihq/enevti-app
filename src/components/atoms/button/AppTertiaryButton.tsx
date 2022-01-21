import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper/src/core/theming';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import color from 'color';

import { Theme } from '../../../theme/default';

interface AppTertiaryButtonProps {
  children: React.ReactNode;
  onPress: () => void;
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
  const styles = makeStyles(theme);

  return loading ? (
    <View style={[styles.tertiaryLoading, styles.tertiaryButton, style]}>
      <ActivityIndicator
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
    tertiaryLoading: {
      borderStyle: 'solid',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color(theme.dark ? 'white' : 'black')
        .alpha(0.29)
        .rgb()
        .string(),
    },
    content: {
      height: hp('7.5%'),
    },
  });
