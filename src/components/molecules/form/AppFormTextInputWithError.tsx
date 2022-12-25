import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { shallowEqual } from 'react-redux';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import AppFormTextInput from 'enevti-app/components/atoms/form/AppFormTextInput';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';

export interface AppFormTextInputWithErrorProps extends TextInputProps {
  theme: Theme;
  errorText?: string;
  showError?: boolean;
  endComponent?: React.ReactNode;
  rowEndComponent?: React.ReactNode;
  hideMaxLengthIndicator?: boolean;
  memoKey?: (keyof AppFormTextInputWithErrorProps)[];
}

function AppFormTextInputWithError(
  { theme, errorText, showError, endComponent, hideMaxLengthIndicator, ...props }: AppFormTextInputWithErrorProps,
  ref: any,
) {
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[props.style]}>
      <AppFormTextInput
        {...props}
        style={undefined}
        ref={ref}
        theme={theme}
        endComponent={endComponent}
        hideMaxLengthIndicator={hideMaxLengthIndicator}
      />
      {showError && errorText ? <AppTextBody4 style={styles.errorText}>{errorText}</AppTextBody4> : null}
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

const forwardedAppFormTextInputWithError = React.forwardRef(AppFormTextInputWithError);

const memoizedAppFormTextInputWithError = React.memo(forwardedAppFormTextInputWithError, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});

export default memoizedAppFormTextInputWithError;
