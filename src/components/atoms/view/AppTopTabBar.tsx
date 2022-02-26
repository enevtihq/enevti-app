import React from 'react';
import Animated from 'react-native-reanimated';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';

interface AppTopTabBarProps extends MaterialTopTabBarProps {
  onIndexChange?: (index: number) => void;
}

export default function AppTopTabBar({
  state,
  descriptors,
  navigation,
  onIndexChange,
  ...props
}: AppTopTabBarProps) {
  const { index } = state;

  React.useEffect(() => {
    onIndexChange?.(index);
  }, [onIndexChange, index]);

  return (
    <Animated.View>
      <MaterialTopTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        {...props}
      />
    </Animated.View>
  );
}
