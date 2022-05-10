import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppTabBarProps extends BottomTabBarProps {
  style?: StyleProp<ViewStyle>;
}

export default function AppTabBar({ state, descriptors, navigation, style }: AppTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={style}>
      <BottomTabBar state={state} descriptors={descriptors} navigation={navigation} insets={insets} />
    </Animated.View>
  );
}
