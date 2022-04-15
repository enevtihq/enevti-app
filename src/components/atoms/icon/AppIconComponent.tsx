import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconProvider = Icon;

export const UNDEFINED_ICON = 'help-circle-outline';

export const iconMap = {
  arrowBack: Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left',
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
  commentFill: 'comment',
  buy: 'basket-outline',
  nftPartitioned: 'puzzle',
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
  createNFT: 'plus-circle',
  camera: 'camera',
  gallery: 'folder-multiple-image',
  identity: 'badge-account-horizontal',
  mintingBehaviour: 'account-cash',
  utility: 'trophy-variant',
  dropDown: 'menu-down',
  everyDay: 'calendar-text',
  everyWeek: 'calendar-range',
  everyMonth: 'calendar',
  everyYear: 'calendar-sync',
  once: 'calendar-account',
  unlimited: 'all-inclusive',
  count: 'history',
  royalty: 'sack-percent',
  arrowRight: 'chevron-right',
  fileImage: 'file-image',
  fileAudio: 'file-music',
  fileVideo: 'file-video',
  fileDocument: 'file-document',
  file: 'file',
  fileCode: 'file-code',
  fileArchive: 'zip-box',
  preview: 'file-find',
  imageUnavailable: 'image-off',
  question: 'help-circle',
  restore: 'backup-restore',
  dollar: 'currency-usd',
  shield: 'shield-check',
  info: 'information-outline',
  random: 'shuffle',
  redeem: 'gift-open-outline',
  mint: 'postage-stamp',
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
