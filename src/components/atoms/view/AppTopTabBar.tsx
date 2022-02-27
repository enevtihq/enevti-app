import React from 'react';
import Animated from 'react-native-reanimated';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface AppTopTabBarProps extends MaterialTopTabBarProps {
  safeBackgroundBarHeight?: number;
  tabStyle?: StyleProp<ViewStyle>;
  onIndexChange?: (index: number) => void;
}

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

  React.useEffect(() => {
    onIndexChange?.(index);
  }, [onIndexChange, index]);

  return (
    <Animated.View style={tabStyle}>
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

const styles = StyleSheet.create({
  safeBackgroundBar: {
    position: 'absolute',
    width: '100%',
  },
});
