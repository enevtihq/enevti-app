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
  importAccount: 'account-reactivate',
  close: 'close',
  binderPassword: UNDEFINED_ICON,
  magnify: 'magnify',
  menu: 'dots-vertical',
  home: 'home-variant',
  statistics: 'chart-bar',
  discover: 'apps',
  notification: 'bell-outline',
  dots: 'dots-vertical',
  likeActive: 'heart',
  likeInactive: 'heart-outline',
  comment: 'comment-outline',
  buy: 'basket-outline',
  nftPartitioned: 'puzzle-outline',
  nftOneKind: 'star',
  nftUpgradable: 'chevron-triple-up',
  utilityVideoCall: 'video-account',
  utilityChat: 'forum',
  utilityContent: 'briefcase-download',
  utilityGift: 'wallet-giftcard',
  utilityQR: 'qrcode',
  utilityStream: 'ticket',
  setting: 'cog-outline',
  edit: 'pencil-outline',
  copy: 'content-copy',
  pool: 'chart-pie',
  twitter: 'twitter',
  wallet: 'wallet',
  delete: 'trash-can-outline',
  add: 'plus',
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
