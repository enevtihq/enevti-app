import { ViewStyle } from 'react-native';
import React from 'react';
import Emoji from 'react-native-emoji';

export const emojiMap = {
  password: 'closed_lock_with_key',
  passphrase: 'zipper_mouth_face',
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
