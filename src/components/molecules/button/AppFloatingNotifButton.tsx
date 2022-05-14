import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import Animated from 'react-native-reanimated';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface AppFloatingNotifButtonProps {
  show: boolean;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function AppFloatingNotifButton({ show, label, onPress, style }: AppFloatingNotifButtonProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);

  return show ? (
    <Animated.View style={[styles.buttonContainer, style]}>
      <AppQuaternaryButton
        box
        style={{ height: hp('5%', insets), backgroundColor: theme.colors.background }}
        onPress={onPress}>
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
