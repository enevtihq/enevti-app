import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconProvider = Icon;

const UNDEFINED_ICON = 'help-circle-outline';

export const iconMap = {
  arrowBack: 'arrow-left',
  google: 'google',
  seePassword: 'eye',
  hidePassword: 'eye-off',
  password: 'cellphone-key',
  passphrase: 'lock',
  accountCreated: UNDEFINED_ICON,
  accountCircle: 'account-circle',
  insideDevice: 'cellphone-cog',
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
