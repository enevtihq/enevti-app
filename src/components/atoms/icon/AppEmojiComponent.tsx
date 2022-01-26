import { ViewStyle } from 'react-native';
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
};

interface AppEmojiComponentProps {
  name: string;
  style?: ViewStyle;
}

export default function AppEmojiComponent({
  name,
  style,
}: AppEmojiComponentProps) {
  return <Emoji name={name} style={style} />;
}