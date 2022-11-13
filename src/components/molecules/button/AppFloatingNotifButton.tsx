import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Theme } from 'enevti-app/theme/default';
import DropShadow from 'react-native-drop-shadow';
import LinearGradient from 'react-native-linear-gradient';

interface AppFloatingNotifButtonProps {
  show: boolean;
  label: string;
  onPress?: () => void;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function AppFloatingNotifButton({ show, label, onPress, onClose, style }: AppFloatingNotifButtonProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const [visible, setVisible] = React.useState<boolean>(() => show);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const display = React.useMemo(() => (visible ? undefined : 'none'), [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  React.useEffect(() => {
    if (show) {
      setVisible(true);
      translateY.value = withTiming(0, { duration: 500 });
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      translateY.value = withTiming(-100, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 }, () => runOnJS(setVisible)(false));
    }
  }, [show, translateY, opacity]);

  return (
    <Animated.View style={[styles.buttonContainer, style, animatedStyle, { display }]}>
      <DropShadow style={styles.dropShadow}>
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.container}>
          <AppQuaternaryButton style={styles.button} onPress={onPress}>
            <AppTextBody4 style={styles.text}>{label}</AppTextBody4>
          </AppQuaternaryButton>
          {onClose ? (
            <AppIconButton color="white" icon={iconMap.close} size={15} style={styles.closeIcon} onPress={onClose} />
          ) : null}
        </LinearGradient>
      </DropShadow>
    </Animated.View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: 10,
      zIndex: 999,
    },
    text: {
      color: 'white',
    },
    container: {
      flexDirection: 'row',
      borderRadius: theme.roundness,
    },
    button: {
      height: hp('5%', insets),
      backgroundColor: 'transparent',
    },
    dropShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.dark ? 1 : 0.3,
      shadowRadius: theme.dark ? 10 : 7,
    },
    closeIcon: {
      justifyContent: 'center',
      marginHorizontal: 2,
    },
  });
