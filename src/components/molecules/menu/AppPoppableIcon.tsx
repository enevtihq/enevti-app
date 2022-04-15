import React from 'react';
import AppPoppable from 'enevti-app/components/atoms/menu/AppPoppable';
import { hp } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconComponent, {
  iconMap,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StyleProp, ViewStyle } from 'react-native';

interface AppPoppableIconProps {
  content: string;
  icon?: string;
  position?: 'right' | 'bottom' | 'left' | 'top';
  width?: number;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

export default function AppPoppableIcon({
  position,
  content,
  icon = iconMap.info,
  width = 50,
  style,
  iconStyle,
}: AppPoppableIconProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <AppPoppable
      position={position}
      content={content}
      width={width}
      style={style}>
      <AppIconComponent
        name={icon}
        color={theme.colors.text}
        size={hp('2%', insets)}
        style={iconStyle}
      />
    </AppPoppable>
  );
}
