import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Persona } from 'enevti-types/account/persona';
import { CallStatus } from 'enevti-types/service/call';
import { useTranslation } from 'react-i18next';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface AppVideoCallHeaderProps {
  status: CallStatus;
  connected: boolean;
  persona?: Persona;
}

const CONNECTED_TRANSLATEY = hp(10);

export default function AppVideoCallHeader({ persona, status, connected }: AppVideoCallHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const statusLabel = React.useCallback(
    (callStatus: CallStatus) => {
      const label = t(`redeem:VCS${callStatus}`);
      return label.charAt(0).toUpperCase() + label.slice(1);
    },
    [t],
  );

  const connectedVal = useSharedValue(0);

  const connectedAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(connectedVal.value, [0, 1], [0, -CONNECTED_TRANSLATEY]) }],
      opacity: interpolate(connectedVal.value, [0, 1], [1, 0]),
    };
  });

  const onConnectedChange = React.useCallback(() => {
    'worklet';
    connectedVal.value = withTiming(connected ? 1 : 0, { duration: 500 });
  }, [connected, connectedVal]);

  React.useEffect(() => {
    onConnectedChange();
  }, [connected, onConnectedChange]);

  return (
    <Animated.View style={[styles.container, connectedAnimatedStyle]}>
      <View style={styles.box}>
        <AppAvatarRenderer persona={persona} size={hp(12)} />
        <AppTextBody3 style={styles.label}>{statusLabel(status)}</AppTextBody3>
      </View>
    </Animated.View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: hp(35) + insets.top,
    },
    box: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    label: {
      marginTop: hp(2),
      color: 'white',
    },
  });
