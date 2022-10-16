import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppText from './AppText';
import AppTextReadMore from './AppTextReadMore';

interface AppTextBaseProps {
  children: React.ReactNode;
  weight: 'bold' | 'normal';
  size: number;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreLimit?: number;
  onPress?: () => void;
  selectable?: boolean;
}

export default function AppTextBase({
  children,
  weight,
  size,
  numberOfLines,
  style,
  readMoreLimit,
  onPress,
  selectable,
}: AppTextBaseProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets, weight, size), [theme, insets, weight, size]);

  const readMoreActivate = React.useMemo(
    () => readMoreLimit && typeof children === 'string' && children.length > readMoreLimit,
    [children, readMoreLimit],
  );

  return readMoreActivate ? (
    <AppTextReadMore
      selectable={selectable}
      style={[styles.text, style]}
      readMoreLimit={readMoreLimit}
      onPress={onPress}>
      {children}
    </AppTextReadMore>
  ) : (
    <AppText selectable={selectable} numberOfLines={numberOfLines} style={[styles.text, style]} onPress={onPress}>
      {children}
    </AppText>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, weight: 'bold' | 'normal', size: number) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
      fontFamily: weight === 'normal' ? theme.fonts.regular.fontFamily : theme.fonts.medium.fontFamily,
      fontWeight: weight === 'normal' ? theme.fonts.regular.fontWeight : theme.fonts.medium.fontWeight,
      fontSize: wp(size, insets),
    },
  });
