import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Emoji from 'react-native-emoji';

export const UNDEFINED_EMOJI = 'question';

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
  add: UNDEFINED_EMOJI,
  createNFT: UNDEFINED_EMOJI,
  camera: UNDEFINED_EMOJI,
  gallery: UNDEFINED_EMOJI,
  identity: UNDEFINED_EMOJI,
  mintingBehaviour: UNDEFINED_EMOJI,
  utility: UNDEFINED_EMOJI,
  dropDown: UNDEFINED_EMOJI,
  everyDay: UNDEFINED_EMOJI,
  everyWeek: UNDEFINED_EMOJI,
  everyMonth: UNDEFINED_EMOJI,
  everyYear: UNDEFINED_EMOJI,
  once: UNDEFINED_EMOJI,
  unlimited: UNDEFINED_EMOJI,
  count: UNDEFINED_EMOJI,
  royalty: UNDEFINED_EMOJI,
  arrowRight: UNDEFINED_EMOJI,
  fileImage: UNDEFINED_EMOJI,
  fileAudio: UNDEFINED_EMOJI,
  fileVideo: UNDEFINED_EMOJI,
  fileDocument: UNDEFINED_EMOJI,
  file: UNDEFINED_EMOJI,
  fileCode: UNDEFINED_EMOJI,
  fileArchive: UNDEFINED_EMOJI,
  preview: UNDEFINED_EMOJI,
  imageUnavailable: UNDEFINED_EMOJI,
  question: UNDEFINED_EMOJI,
  restore: UNDEFINED_EMOJI,
  dollar: UNDEFINED_EMOJI,
  shield: UNDEFINED_EMOJI,
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
