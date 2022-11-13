import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { Popable } from 'react-native-popable';
import AppTextBody4 from '../text/AppTextBody4';
import { Theme } from 'enevti-app/theme/default';
import { SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import Color from 'color';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppPoppableProps {
  children: React.ReactNode;
  content: string;
  action?: 'hover' | 'press' | 'longpress';
  position?: 'bottom' | 'left' | 'right' | 'top';
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AppPoppable({ children, action, content, position, width = 50, style }: AppPoppableProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets, width), [theme, insets, width]);
  return (
    <Popable
      action={action}
      position={position}
      style={[styles.popableView, style]}
      content={
        <View style={styles.popableContent}>
          <AppTextBody4 style={styles.popableText}>{content}</AppTextBody4>
        </View>
      }>
      {children}
    </Popable>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, width: number) =>
  StyleSheet.create({
    popableView: {
      width: wp(width, insets),
      top: Platform.OS === 'android' ? -(insets.top / 2) : undefined,
    },
    popableContent: {
      padding: 10,
      backgroundColor: theme.dark
        ? Color(theme.colors.text).lighten(0.5).rgb().string()
        : Color(theme.colors.text).darken(0.05).rgb().string(),
    },
    popableText: {
      color: theme.colors.background,
    },
  });
