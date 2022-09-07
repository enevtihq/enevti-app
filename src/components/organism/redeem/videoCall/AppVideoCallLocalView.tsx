import { hp, wp } from 'enevti-app/utils/imageRatio';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, interpolate, withTiming } from 'react-native-reanimated';
import { TwilioVideoLocalView } from 'react-native-twilio-video-webrtc';

interface AppVideoCallLocalViewProps {
  connected: boolean;
  minimized: boolean;
}

const CONNECTED_TRANSLATEX = wp(135);
const CONNECTED_TRANSLATEY = hp(80);
const MINIMIZED_TRANSLATEY = hp(60);

export default function AppVideoCallLocalView({ connected, minimized }: AppVideoCallLocalViewProps) {
  const styles = React.useMemo(() => makeStyles(), []);
  const connectedVal = useSharedValue(0);
  const minimizedVal = useSharedValue(0);

  const connectedAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(connectedVal.value, [0, 1], [1, 0.25]) },
        { translateX: interpolate(connectedVal.value, [0, 1], [0, CONNECTED_TRANSLATEX]) },
        { translateY: interpolate(connectedVal.value, [0, 1], [0, CONNECTED_TRANSLATEY]) },
      ],
    };
  });

  const minimizedAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(minimizedVal.value, [0, 1], [0, MINIMIZED_TRANSLATEY]) }],
    };
  });

  const onConnectedChange = React.useCallback(() => {
    'worklet';
    connectedVal.value = withTiming(connected ? 1 : 0, { duration: 1000 });
    if (connected) {
      minimizedVal.value = withTiming(minimized ? 1 : 0, { duration: 1000 });
    }
  }, [minimized, minimizedVal, connected, connectedVal]);

  React.useEffect(() => {
    onConnectedChange();
  }, [connected, onConnectedChange]);

  return (
    <Animated.View style={[styles.container, connectedAnimatedStyle]}>
      <Animated.View style={[styles.container, minimizedAnimatedStyle]}>
        <TwilioVideoLocalView enabled={true} style={styles.container} />
      </Animated.View>
    </Animated.View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
  });
