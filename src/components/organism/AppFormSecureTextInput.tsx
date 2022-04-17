import React from 'react';
import { ReturnKeyTypeOptions, StyleProp, TextStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

export interface AppFormSecureTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  dense?: boolean;
  touchHandler?: () => void;
  onFocus?: (e: any) => void;
  errorText?: string;
  showError?: boolean;
  onSubmitEditing?: () => void;
  style?: StyleProp<TextStyle>;
  returnKeyType?: ReturnKeyTypeOptions;
  blurOnSubmit?: boolean;
}

function AppFormSecureTextInput(
  {
    label,
    value,
    showError,
    touchHandler,
    onFocus,
    errorText,
    onChangeText,
    dense,
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
      dense={dense}
      showError={showError}
      errorText={errorText}
      secureTextEntry={secure}
      textContentType={'password'}
      onFocus={onFocus}
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
