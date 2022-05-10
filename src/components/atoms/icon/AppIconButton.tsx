import React from 'react';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

interface AppIconButtonProps {
  icon: string;
  size?: number;
  onPress?: (e?: any) => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  animatedIconStyle?: StyleProp<TextStyle>;
}

export default function AppIconButton({ icon, size, onPress, color, style, animatedIconStyle }: AppIconButtonProps) {
  const theme = useTheme();
  const iSize = size ? size : Platform.OS === 'ios' ? 35 : 23;

  return (
    <Animated.View style={[{ borderRadius: iSize, overflow: hidden, width: iSize * 1.25 }, style]}>
      <TouchableRipple onPress={onPress} style={{ padding: iSize / 7 }}>
        <AnimatedIcon name={icon} size={iSize} style={[{ color: color ?? theme.colors.text }, animatedIconStyle]} />
      </TouchableRipple>
    </Animated.View>
  );
}

const hidden = 'hidden';
