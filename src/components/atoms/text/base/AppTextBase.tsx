import React from 'react';
import { NativeSyntheticEvent, StyleProp, StyleSheet, TextLayoutEventData, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { hp } from 'enevti-app/utils/layout/imageRatio';
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
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
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
  onTextLayout,
  selectable,
}: AppTextBaseProps): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, weight, size), [theme, weight, size]);

  const readMoreActivate = React.useMemo(
    () => readMoreLimit && typeof children === 'string' && children.length > readMoreLimit,
    [children, readMoreLimit],
  );

  return readMoreActivate ? (
    <AppTextReadMore
      onTextLayout={onTextLayout}
      selectable={selectable}
      style={[styles.text, style]}
      readMoreLimit={readMoreLimit}
      onPress={onPress}>
      {children}
    </AppTextReadMore>
  ) : (
    <AppText
      onTextLayout={onTextLayout}
      selectable={selectable}
      numberOfLines={numberOfLines}
      style={[styles.text, style]}
      onPress={onPress}>
      {children}
    </AppText>
  );
}

const makeStyles = (theme: Theme, weight: 'bold' | 'normal', size: number) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
      fontFamily: weight === 'normal' ? theme.fonts.regular.fontFamily : theme.fonts.medium.fontFamily,
      fontWeight: weight === 'normal' ? theme.fonts.regular.fontWeight : theme.fonts.medium.fontWeight,
      fontSize: hp(size),
    },
  });
