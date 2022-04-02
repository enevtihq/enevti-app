import { View, StyleProp, TextStyle, Pressable } from 'react-native';
import React from 'react';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';

interface AppPersonaLabelProps {
  persona: Persona;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  usernameStyle?: StyleProp<TextStyle>;
  addressStyle?: StyleProp<TextStyle>;
  textComponent?: any;
  usernameComponent?: any;
  addressComponent?: any;
}

export default function AppPersonaLabel({
  persona,
  onPress,
  style,
  usernameStyle,
  addressStyle,
  textComponent,
  usernameComponent,
  addressComponent,
}: AppPersonaLabelProps) {
  const LabelView = onPress ? Pressable : View;
  const label = persona.username
    ? persona.username
    : persona.address
    ? persona.address
    : '???';
  const DefaultComponent = AppTextHeading4;
  const Text = textComponent
    ? textComponent
    : persona.username
    ? usernameComponent
      ? usernameComponent
      : DefaultComponent
    : persona.address
    ? addressComponent
      ? addressComponent
      : DefaultComponent
    : DefaultComponent;
  const additionalStyle = persona.username
    ? usernameStyle
    : persona.address
    ? addressStyle
    : undefined;

  return (
    <LabelView onPress={onPress} style={[style, additionalStyle]}>
      <Text numberOfLines={1}>{label}</Text>
    </LabelView>
  );
}
