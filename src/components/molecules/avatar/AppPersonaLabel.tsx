import { View, StyleProp, TextStyle, Pressable } from 'react-native';
import React from 'react';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';

interface AppPersonaLabelProps {
  persona: Persona;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  textComponent?: any;
}

export default function AppPersonaLabel({
  persona,
  onPress,
  style,
  textComponent,
}: AppPersonaLabelProps) {
  const LabelView = onPress ? Pressable : View;
  const Text = textComponent ? textComponent : AppTextHeading4;
  return (
    <LabelView onPress={onPress} style={style}>
      <Text numberOfLines={1}>
        {persona.username ? persona.username : persona.address}
      </Text>
    </LabelView>
  );
}
