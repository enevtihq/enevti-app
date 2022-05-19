import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from 'enevti-app/utils/imageRatio';
import Animated from 'react-native-reanimated';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Theme } from 'enevti-app/theme/default';
import DropShadow from 'react-native-drop-shadow';

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
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return show ? (
    <Animated.View style={[styles.buttonContainer, style]}>
      <DropShadow style={styles.dropShadow}>
        <View style={styles.container}>
          <AppQuaternaryButton
            style={{ height: hp('5%', insets), backgroundColor: theme.colors.background }}
            onPress={onPress}>
            <AppTextBody4>{label}</AppTextBody4>
          </AppQuaternaryButton>
          {onClose ? <AppIconButton icon={iconMap.close} size={15} style={styles.closeIcon} onPress={onClose} /> : null}
        </View>
      </DropShadow>
    </Animated.View>
  ) : null;
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: 10,
      zIndex: 999,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
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
