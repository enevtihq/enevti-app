import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconProvider = Icon;

export const iconMap = {
  arrowBack: 'arrow-left',
  key: 'cellphone-key',
  google: 'google',
  seePassword: 'eye',
  hidePassword: 'eye-off',
};

interface AppIconComponentProps {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppIconComponent({
  name,
  size,
  color,
  style,
}: AppIconComponentProps) {
  return (
    <View style={style}>
      <Icon name={name} size={size} color={color} />
    </View>
  );
}
