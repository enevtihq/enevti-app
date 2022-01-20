import React from 'react';
import { ReturnKeyTypeOptions, TextStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import AppFormTextInput from '../atoms/form/AppFormTextInput';
import { iconMap } from '../atoms/icon/AppIconComponent';

interface AppFormSecureTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  style?: TextStyle;
  returnKeyType?: ReturnKeyTypeOptions;
}

function AppFormSecureTextInput(
  {
    label,
    value,
    onChangeText,
    onSubmitEditing,
    style,
    returnKeyType,
  }: AppFormSecureTextInputProps,
  ref: any,
) {
  const theme = useTheme();
  const [secure, setSecure] = React.useState(true);

  return (
    <AppFormTextInput
      ref={ref}
      theme={theme}
      label={label}
      secureTextEntry={secure}
      onBlur={() => setSecure(true)}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      style={style}
      returnKeyType={returnKeyType}
      right={
        <TextInput.Icon
          name={secure ? iconMap.seePassword : iconMap.hidePassword}
          onPress={() => setSecure(!secure)}
          color={theme.colors.placeholder}
          forceTextInputFocus={false}
        />
      }
    />
  );
}

const forwardedAppFormSecureTextInput = React.forwardRef(
  AppFormSecureTextInput,
);
export default forwardedAppFormSecureTextInput;
