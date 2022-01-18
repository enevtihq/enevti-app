import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { Theme } from '../../theme/default';

interface AppTextHeading1Props {
  children: React.ReactNode;
  style?: TextStyle;
}

export default function AppTextHeading1({
  children,
  style,
}: AppTextHeading1Props): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);

  return <Text style={[styles.heading1, style]}>{children}</Text>;
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    heading1: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: 21,
    },
  });
