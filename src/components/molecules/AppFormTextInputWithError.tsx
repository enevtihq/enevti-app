import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppFormTextInput from '../atoms/form/AppFormTextInput';
import AppTextBody3 from '../atoms/text/AppTextBody3';

interface AppFormTextInputWithErrorProps extends TextInputProps {
  theme: Theme;
  errorText?: string;
}

function AppFormTextInputWithError(
  { theme, errorText, ...props }: AppFormTextInputWithErrorProps,
  ref: any,
) {
  const styles = makeStyles(theme);

  return (
    <View style={props.style}>
      <AppFormTextInput {...props} style={undefined} ref={ref} theme={theme} />
      {errorText ? (
        <AppTextBody3 style={styles.errorText}>{errorText}</AppTextBody3>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    errorText: {
      color: theme.colors.error,
      marginTop: hp('1%'),
      marginLeft: 14,
      marginRight: 14,
    },
  });

const forwardedAppFormTextInputWithError = React.forwardRef(
  AppFormTextInputWithError,
);
export default forwardedAppFormTextInputWithError;
