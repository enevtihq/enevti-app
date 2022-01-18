import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { Theme } from '../../theme/default';

interface AppTextBody3Props {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function AppTextBody3({
  children,
  style,
}: AppTextBody3Props): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);

  return <Text style={[styles.heading1, style]}>{children}</Text>;
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    heading1: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: 13,
    },
  });
