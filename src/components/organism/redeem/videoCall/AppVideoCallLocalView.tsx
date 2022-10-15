import Color from 'color';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import darkTheme from 'enevti-app/theme/dark';
import { Persona } from 'enevti-app/types/core/account/persona';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, interpolate, withTiming } from 'react-native-reanimated';
import { TwilioVideoLocalView } from 'react-native-twilio-video-webrtc';

interface AppVideoCallLocalViewProps {
  persona: Persona;
  connected: boolean;
  minimized: boolean;
  micOff?: boolean;
  videoOff?: boolean;
}

const CONNECTED_TRANSLATEX = wp(135);
const CONNECTED_TRANSLATEY = hp(70);
const MINIMIZED_TRANSLATEY = hp(60);

export default function AppVideoCallLocalView({
  connected,
  minimized,
  micOff,
  persona,
  videoOff,
}: AppVideoCallLocalViewProps) {
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
      minimizedVal.value = withTiming(minimized ? 1 : 0, { duration: 500 });
    }
  }, [minimized, minimizedVal, connected, connectedVal]);

  React.useEffect(() => {
    onConnectedChange();
  }, [connected, onConnectedChange]);

  return (
    <Animated.View style={[styles.container, connectedAnimatedStyle]}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: Color('white').darken(0.9).rgb().toString() },
          minimizedAnimatedStyle,
        ]}>
        {videoOff ? (
          <View style={styles.avatar}>
            <AppAvatarRenderer persona={persona} size={hp(14)} />
          </View>
        ) : (
          <TwilioVideoLocalView enabled={true} style={styles.container} />
        )}
        {micOff ? (
          <View style={styles.micOff}>
            <AppIconComponent name={iconMap.micOff} size={hp(5)} color={darkTheme.colors.text} />
          </View>
        ) : null}
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
    avatar: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    micOff: {
      position: 'absolute',
      width: wp(15),
      height: wp(15),
      top: wp(10),
      right: wp(10),
      backgroundColor: Color(darkTheme.colors.placeholder).alpha(0.3).rgb().toString(),
      padding: wp(2.5),
      borderRadius: wp(10),
    },
  });
