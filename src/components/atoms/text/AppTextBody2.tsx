import { useTheme } from 'react-native-paper';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTextBody2Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export default function AppTextBody2({
  children,
  numberOfLines,
  style,
}: AppTextBody2Props): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[styles.body2, style]}>
      {children}
    </Text>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    body2: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('5.2%', insets),
    },
  });
