import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from '../../utils/imageRatio';
import AppFormTextInput from '../atoms/form/AppFormTextInput';
import AppTextBody4 from '../atoms/text/AppTextBody4';

export interface AppFormTextInputWithErrorProps extends TextInputProps {
  theme: Theme;
  errorText?: string;
  showError?: boolean;
}

function AppFormTextInputWithError(
  { theme, errorText, showError, ...props }: AppFormTextInputWithErrorProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);
  const height = props.numberOfLines ? props.numberOfLines * 25 : undefined;
  const paddingBottom = props.maxLength ? 10 : undefined;

  return (
    <View style={[props.style]}>
      <AppFormTextInput
        {...props}
        style={{ minHeight: height, maxHeight: height, paddingBottom }}
        ref={ref}
        theme={theme}
        numberOfLines={Platform.OS === 'ios' ? undefined : props.numberOfLines}
      />
      {showError && errorText ? (
        <AppTextBody4 style={styles.errorText}>{errorText}</AppTextBody4>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    errorText: {
      color: theme.colors.error,
      marginTop: hp('1%', insets),
      marginLeft: 14,
      marginRight: 14,
    },
  });

const forwardedAppFormTextInputWithError = React.forwardRef(
  AppFormTextInputWithError,
);

const memoizedAppFormTextInputWithError = React.memo(
  forwardedAppFormTextInputWithError,
);

export default memoizedAppFormTextInputWithError;
