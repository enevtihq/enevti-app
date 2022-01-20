import React from 'react';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper/src/core/theming';
import color from 'color';
import { StyleSheet } from 'react-native';

function AppFormTextInput(props: TextInputProps, ref: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <TextInput
      {...props}
      mode={'outlined'}
      ref={ref}
      outlineColor={styles.appFormTextInput.backgroundColor}
      style={[styles.appFormTextInput, props.style]}
    />
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    appFormTextInput: {
      borderRadius: theme.roundness,
      backgroundColor: theme.dark
        ? color(theme.colors.background).lighten(0.6).rgb().toString()
        : color(theme.colors.background).darken(0.04).rgb().toString(),
    },
  });

const forwardedAppFormTextInput = React.forwardRef(AppFormTextInput);

export default forwardedAppFormTextInput;
