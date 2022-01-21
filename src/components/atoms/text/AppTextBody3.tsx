import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTextBody3Props {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function AppTextBody3({
  children,
  style,
}: AppTextBody3Props): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return <Text style={[styles.heading1, style]}>{children}</Text>;
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    heading1: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('3.5%', insets),
    },
  });
