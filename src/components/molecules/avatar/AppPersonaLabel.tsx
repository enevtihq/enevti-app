import { View, StyleProp, TextStyle, Pressable } from 'react-native';
import React from 'react';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';

interface AppPersonaLabelProps {
  persona: Persona;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  usernameStyle?: StyleProp<TextStyle>;
  base32Style?: StyleProp<TextStyle>;
  textComponent?: any;
  usernameComponent?: any;
  base32Component?: any;
}

export default function AppPersonaLabel({
  persona,
  onPress,
  style,
  usernameStyle,
  base32Style,
  textComponent,
  usernameComponent,
  base32Component,
}: AppPersonaLabelProps) {
  const LabelView = onPress ? Pressable : View;
  const label = parsePersonaLabel(persona);
  const DefaultComponent = AppTextHeading4;
  const Text = textComponent
    ? textComponent
    : persona.username
    ? usernameComponent
      ? usernameComponent
      : DefaultComponent
    : persona.base32
    ? base32Component
      ? base32Component
      : DefaultComponent
    : DefaultComponent;
  const additionalStyle = persona.username
    ? usernameStyle
    : persona.base32
    ? base32Style
    : undefined;

  return (
    <LabelView onPress={onPress} style={[style, additionalStyle]}>
      <Text numberOfLines={1}>{label}</Text>
    </LabelView>
  );
}
