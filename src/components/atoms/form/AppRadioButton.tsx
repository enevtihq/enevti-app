import { Theme } from 'enevti-app/theme/default';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';

interface AppRadioButtonProps {
  value: string;
  checked: string;
  onPress?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export default function AppRadioButton({ value, checked, onPress, style }: AppRadioButtonProps) {
  const theme = useTheme() as Theme;

  return (
    <RadioButton.Android
      value={value}
      status={checked === value ? 'checked' : 'unchecked'}
      onPress={onPress ? () => onPress(value) : undefined}
      color={theme.colors.primary}
      style={style}
    />
  );
}
