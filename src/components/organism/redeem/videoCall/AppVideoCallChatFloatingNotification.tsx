import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Theme } from 'enevti-app/theme/default';
import DropShadow from 'react-native-drop-shadow';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';

interface AppVideoCallChatFloatingNotificationProps {
  show: boolean;
  label: string;
  participantPersona?: Persona;
  onPress?: () => void;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function AppVideoCallChatFloatingNotification({
  show,
  label,
  participantPersona,
  onPress,
  onClose,
  style,
}: AppVideoCallChatFloatingNotificationProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const showTimeout = React.useRef<any>();

  const [visible, setVisible] = React.useState<boolean>(() => show);
  const translateY = useSharedValue(-25);
  const opacity = useSharedValue(0);
  const display = React.useMemo(() => (visible ? undefined : 'none'), [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const closeCallback = React.useCallback(() => {
    translateY.value = withTiming(-25, { duration: 500 });
    opacity.value = withTiming(0, { duration: 500 }, () => {
      runOnJS(setVisible)(false);
      onClose && runOnJS(onClose)();
    });
    clearTimeout(showTimeout.current);
  }, [onClose, opacity, translateY]);

  React.useEffect(() => {
    if (show) {
      setVisible(true);
      translateY.value = withTiming(75, { duration: 500 });
      opacity.value = withTiming(1, { duration: 500 });
      clearTimeout(showTimeout.current);
      showTimeout.current = setTimeout(() => {
        closeCallback();
        clearTimeout(showTimeout.current);
      }, 5000);
    }
  }, [closeCallback, show, label, onClose, opacity, translateY]);

  return (
    <Animated.View style={[styles.buttonContainer, style, animatedStyle, { display }]}>
      <DropShadow style={styles.dropShadow}>
        <AppQuaternaryButton style={styles.button} onPress={onPress}>
          <View style={styles.buttonContent}>
            <AppAvatarRenderer persona={participantPersona} size={hp(3)} />
            <AppTextBody4 style={styles.text} numberOfLines={1}>
              {label}
            </AppTextBody4>
            <AppIconButton icon={iconMap.close} size={15} style={styles.closeIcon} onPress={closeCallback} />
          </View>
        </AppQuaternaryButton>
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
      marginLeft: wp(2),
      maxWidth: wp(70),
    },
    container: {
      flexDirection: 'row',
      borderRadius: theme.roundness,
    },
    button: {
      height: hp('5%', insets),
      backgroundColor: theme.colors.background,
    },
    buttonContent: {
      flexDirection: 'row',
      maxWidth: wp(85),
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
