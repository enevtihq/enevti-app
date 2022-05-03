import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface AppFloatingNotifButtonProps {
  show: boolean;
  label: string;
  onPress?: () => void;
}

export default function AppFloatingNotifButton({
  show,
  label,
  onPress,
}: AppFloatingNotifButtonProps) {
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);

  return show ? (
    <Animated.View entering={FadeInUp} exiting={FadeInDown} style={styles.buttonContainer}>
      <AppQuaternaryButton box style={{ height: hp('5%', insets) }} onPress={onPress}>
        <AppTextBody4>{label}</AppTextBody4>
      </AppQuaternaryButton>
    </Animated.View>
  ) : null;
}

const makeStyles = () =>
  StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: 10,
      zIndex: 999,
    },
  });
