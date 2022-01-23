import React from 'react';
import { ReturnKeyTypeOptions, TextStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import AppFormTextInputWithError from '../molecules/AppFormTextInputWithError';
import { iconMap } from '../atoms/icon/AppIconComponent';

interface AppFormSecureTextInputProps {
  label: string;
  value: string;
  touchHandler?: () => void;
  onChangeText: (text: string) => void;
  errorText?: string;
  showError?: boolean;
  onSubmitEditing?: () => void;
  style?: TextStyle;
  returnKeyType?: ReturnKeyTypeOptions;
  blurOnSubmit?: boolean;
}

function AppFormSecureTextInput(
  {
    label,
    value,
    showError,
    touchHandler,
    errorText,
    onChangeText,
    onSubmitEditing,
    style,
    returnKeyType,
    blurOnSubmit,
  }: AppFormSecureTextInputProps,
  ref: any,
) {
  const theme = useTheme();
  const [secure, setSecure] = React.useState(true);

  return (
    <AppFormTextInputWithError
      ref={ref}
      theme={theme}
      label={label}
      showError={showError}
      errorText={errorText}
      secureTextEntry={secure}
      textContentType={'password'}
      onBlur={() => {
        setSecure(true);
        touchHandler && touchHandler();
      }}
      autoCapitalize={'none'}
      autoComplete={'password'}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      style={style}
      returnKeyType={returnKeyType}
      blurOnSubmit={blurOnSubmit}
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
