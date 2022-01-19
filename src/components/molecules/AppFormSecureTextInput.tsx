import React from 'react';
import { TextStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import AppFormTextInput from '../atoms/form/AppFormTextInput';
import { iconMap } from '../atoms/icon/AppIconComponent';

interface AppFormSecureTextInputProps {
  label: string;
  style?: TextStyle;
}

export default function AppFormSecureTextInput({
  label,
  style,
}: AppFormSecureTextInputProps) {
  const theme = useTheme();

  return (
    <AppFormTextInput
      theme={theme}
      label={label}
      secureTextEntry
      style={style}
      right={
        <TextInput.Icon
          name={iconMap.seePassword}
          onPress={() => console.log('pressed')}
          color={theme.colors.placeholder}
        />
      }
    />
  );
}
