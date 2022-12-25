import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useTheme } from 'react-native-paper';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import Color from 'color';

import { Theme } from 'enevti-app/theme/default';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppTertiaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
}

export default function AppTertiaryButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
  theme,
}: AppTertiaryButtonProps): JSX.Element {
  const paperTheme = useTheme() as Theme;
  const buttonTheme = theme ?? paperTheme;
  const styles = React.useMemo(() => makeStyles(buttonTheme), [buttonTheme]);

  return loading ? (
    <View style={[styles.tertiaryLoading, styles.tertiaryButton, style]}>
      <AppActivityIndicator animating={true} style={styles.loading} color={buttonTheme.colors.text} />
    </View>
  ) : (
    <Button
      theme={buttonTheme as any}
      disabled={disabled}
      mode="outlined"
      color={buttonTheme.dark ? 'white' : 'black'}
      icon={icon}
      onPress={onPress}
      uppercase={false}
      contentStyle={[styles.content, style]}
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
      borderColor: Color(theme.dark ? 'white' : 'black')
        .alpha(0.29)
        .rgb()
        .string(),
    },
    content: {
      height: hp('7.5%'),
    },
    loading: {
      height: hp('7.5%'),
      justifyContent: 'center',
    },
  });
