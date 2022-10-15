import React from 'react';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

interface AppIconButtonProps {
  icon: string;
  disabled?: boolean;
  size?: number;
  onPress?: (e?: any) => void;
  onPressOut?: (e?: any) => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  animatedIconStyle?: StyleProp<TextStyle>;
  rippleColor?: string;
}

export default function AppIconButton({
  icon,
  disabled,
  size,
  onPress,
  onPressOut,
  color,
  style,
  animatedIconStyle,
  rippleColor,
}: AppIconButtonProps) {
  const theme = useTheme();
  const iSize = size ? size : Platform.OS === 'ios' ? 35 : 23;
  const opacity = disabled ? 0.2 : 1;

  return (
    <Animated.View style={[{ borderRadius: iSize, overflow: hidden, width: iSize * 1.25, opacity }, style]}>
      <TouchableRipple
        onPressOut={disabled ? undefined : onPressOut}
        onPress={disabled ? undefined : onPress}
        rippleColor={rippleColor}
        style={{
          padding: iSize / 7,
          alignItems: center,
          width: style ? (style as { width: number | undefined }).width : undefined,
        }}>
        <AnimatedIcon name={icon} size={iSize} style={[{ color: color ?? theme.colors.text }, animatedIconStyle]} />
      </TouchableRipple>
    </Animated.View>
  );
}

const hidden = 'hidden';
const center = 'center';
