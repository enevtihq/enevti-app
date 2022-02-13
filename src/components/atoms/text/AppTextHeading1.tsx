import { useTheme } from 'react-native-paper';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTextHeading1Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: TextStyle;
}

export default function AppTextHeading1({
  children,
  numberOfLines,
  style,
}: AppTextHeading1Props): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[styles.heading1, style]}>
      {children}
    </Text>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    heading1: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: wp('5.8%', insets),
    },
  });
