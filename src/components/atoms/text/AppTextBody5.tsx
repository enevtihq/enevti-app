import { useTheme } from 'react-native-paper';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTextBody5Props {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: TextStyle;
}

export default function AppTextBody5({
  children,
  numberOfLines,
  style,
}: AppTextBody5Props): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Text numberOfLines={numberOfLines} style={[styles.body5, style]}>
      {children}
    </Text>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    body5: {
      color: theme.colors.text,
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('2.2%', insets),
    },
  });