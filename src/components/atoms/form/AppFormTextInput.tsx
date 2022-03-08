import React from 'react';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import { StyleSheet, View } from 'react-native';
import AppTextBody5 from '../text/AppTextBody5';

function AppFormTextInput(props: TextInputProps, ref: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [maxLengthShow, setMaxLengthShow] = React.useState<boolean>(false);
  const [textLength, setTextLength] = React.useState<number>(0);

  const onFocus = React.useCallback(
    e => {
      setMaxLengthShow(true);
      props.onFocus && props.onFocus(e);
    },
    [props],
  );

  const onBlur = React.useCallback(
    e => {
      setMaxLengthShow(false);
      props.onBlur && props.onBlur(e);
    },
    [props],
  );

  const onChangeText = React.useCallback(
    (e: string) => {
      setTextLength(e.length);
      props.onChangeText && props.onChangeText(e);
    },
    [props],
  );

  return (
    <View>
      <TextInput
        {...props}
        mode={'outlined'}
        ref={ref}
        outlineColor={styles.appFormTextInput.backgroundColor}
        style={[styles.appFormTextInput, props.style]}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
      {maxLengthShow && props.maxLength ? (
        <AppTextBody5 style={styles.maxLength}>
          {textLength} / {props.maxLength}
        </AppTextBody5>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    appFormTextInput: {
      borderRadius: theme.roundness,
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.6).rgb().toString()
        : Color(theme.colors.background).darken(0.04).rgb().toString(),
    },
    maxLength: {
      color: theme.colors.placeholder,
      position: 'absolute',
      bottom: 5,
      right: 15,
    },
  });

const forwardedAppFormTextInput = React.forwardRef(AppFormTextInput);

const memoizedAppFormTextInput = React.memo(forwardedAppFormTextInput);

export default memoizedAppFormTextInput;
