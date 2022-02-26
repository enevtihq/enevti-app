import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Emoji from 'react-native-emoji';

const UNDEFINED_EMOJI = 'question';

export const emojiMap = {
  arrowBack: UNDEFINED_EMOJI,
  google: UNDEFINED_EMOJI,
  seePassword: UNDEFINED_EMOJI,
  hidePassword: UNDEFINED_EMOJI,
  password: 'closed_lock_with_key',
  passphrase: 'zipper_mouth_face',
  accountCreated: 'grinning_face_with_star_eyes',
  accountCircle: UNDEFINED_EMOJI,
  insideDevice: UNDEFINED_EMOJI,
  importAccount: 'inbox_tray',
  close: UNDEFINED_EMOJI,
  binderPassword: 'key',
  magnify: UNDEFINED_EMOJI,
  menu: UNDEFINED_EMOJI,
  home: UNDEFINED_EMOJI,
  statistics: UNDEFINED_EMOJI,
  discover: UNDEFINED_EMOJI,
  notification: UNDEFINED_EMOJI,
  dots: UNDEFINED_EMOJI,
  likeActive: UNDEFINED_EMOJI,
  likeInactive: UNDEFINED_EMOJI,
  comment: UNDEFINED_EMOJI,
  buy: UNDEFINED_EMOJI,
  nftPartitioned: UNDEFINED_EMOJI,
  nftOneKind: UNDEFINED_EMOJI,
  nftUpgradable: UNDEFINED_EMOJI,
  utilityVideoCall: UNDEFINED_EMOJI,
  utilityChat: UNDEFINED_EMOJI,
  utilityContent: UNDEFINED_EMOJI,
  utilityGift: UNDEFINED_EMOJI,
  utilityQR: UNDEFINED_EMOJI,
  utilityStream: UNDEFINED_EMOJI,
  setting: UNDEFINED_EMOJI,
  edit: UNDEFINED_EMOJI,
  copy: UNDEFINED_EMOJI,
  pool: UNDEFINED_EMOJI,
  twitter: UNDEFINED_EMOJI,
  wallet: UNDEFINED_EMOJI,
  delete: UNDEFINED_EMOJI,
};

interface AppEmojiComponentProps {
  name: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppEmojiComponent({
  name,
  style,
}: AppEmojiComponentProps) {
  return <Emoji name={name} style={style} />;
}
