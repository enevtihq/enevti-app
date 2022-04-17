import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Emoji from 'react-native-emoji';

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
