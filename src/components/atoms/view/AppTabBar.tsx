import { BottomTabBar } from '@react-navigation/bottom-tabs';
import React from 'react';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppTabBar({
  state,
  descriptors,
  navigation,
  style,
}: any) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={style}>
      <BottomTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        insets={insets}
      />
    </Animated.View>
  );
}
