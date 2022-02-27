import React from 'react';
import Animated from 'react-native-reanimated';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from '../../../utils/imageRatio';

interface AppTopTabBarProps extends MaterialTopTabBarProps {
  safeBackgroundBarHeight?: number;
  tabStyle?: StyleProp<ViewStyle>;
  onIndexChange?: (index: number) => void;
}

export const TOP_TABBAR_HEIGHT_PERCENTAGE = 6;

export default function AppTopTabBar({
  safeBackgroundBarHeight,
  state,
  descriptors,
  navigation,
  tabStyle,
  onIndexChange,
  ...props
}: AppTopTabBarProps) {
  const { index } = state;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  React.useEffect(() => {
    onIndexChange?.(index);
  }, [onIndexChange, index]);

  return (
    <Animated.View style={[styles.topTabBar, tabStyle]}>
      {safeBackgroundBarHeight ? (
        <View
          style={[
            styles.safeBackgroundBar,
            {
              top: -safeBackgroundBarHeight,
              backgroundColor: theme.colors.background,
              height: safeBackgroundBarHeight,
            },
          ]}
        />
      ) : null}
      <MaterialTopTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        {...props}
      />
    </Animated.View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    topTabBar: {
      height: hp(TOP_TABBAR_HEIGHT_PERCENTAGE, insets),
    },
    safeBackgroundBar: {
      position: 'absolute',
      width: '100%',
    },
  });
