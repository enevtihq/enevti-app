import { useTheme } from 'react-native-paper';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTextHeading3Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: TextStyle;
}

export default function AppTextHeading3({
  children,
  numberOfLines,
  style,
}: AppTextHeading3Props): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[styles.heading3, style]}>
      {children}
    </Text>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    heading3: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: wp('4.0%', insets),
    },
  });
