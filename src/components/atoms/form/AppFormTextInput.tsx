import React from 'react';
import { TextInputProps } from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import { TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Color from 'color';
import { StyleSheet, View } from 'react-native';
import AppTextBody5 from '../text/AppTextBody5';

function AppFormTextInput(
  props: TextInputProps & {
    endComponent?: React.ReactNode;
    hideMaxLengthIndicator?: boolean;
  },
  ref: any,
) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const height = props.numberOfLines ? props.numberOfLines * 25 : undefined;
  const paddingBottom =
    props.maxLength && !props.hideMaxLengthIndicator ? 10 : undefined;
  const initialLength = props.value
    ? props.value.toString().length
    : props.defaultValue
    ? props.defaultValue.toString().length
    : 0;

  const [maxLengthShow, setMaxLengthShow] = React.useState<boolean>(false);
  const [textLength, setTextLength] = React.useState<number>(initialLength);

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
        style={[
          styles.appFormTextInput,
          { minHeight: height, maxHeight: height, paddingBottom },
          props.style,
        ]}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
      {props.endComponent ? (
        <View style={styles.endComponent}>{props.endComponent}</View>
      ) : null}
      {maxLengthShow && props.maxLength && !props.hideMaxLengthIndicator ? (
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
    endComponent: {
      position: 'absolute',
      height: '90%',
      top: '10%',
      right: 0,
      alignItems: 'center',
    },
  });

const forwardedAppFormTextInput = React.forwardRef(AppFormTextInput);

const memoizedAppFormTextInput = React.memo(forwardedAppFormTextInput);

export default memoizedAppFormTextInput;
