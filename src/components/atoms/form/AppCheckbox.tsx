import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Checkbox, TouchableRipple, useTheme } from 'react-native-paper';
import AppTextBody3 from '../text/AppTextBody3';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface AppCheckboxProps {
  children: React.ReactNode;
  value: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  uncheckedColor?: string;
}

export default function AppCheckbox({
  children,
  value,
  style,
  disabled,
  onPress,
  uncheckedColor,
}: AppCheckboxProps) {
  const theme = useTheme();
  const styles = makeStyle();

  return (
    <View style={[style]}>
      <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" onPress={onPress}>
        <View style={styles.appCheckboxView}>
          <View style={styles.checkbox}>
            <Checkbox.Android
              status={value ? 'checked' : 'unchecked'}
              disabled={disabled}
              uncheckedColor={uncheckedColor}
              color={theme.colors.primary}
              theme={theme}
            />
          </View>
          <View style={styles.textContainer}>
            <AppTextBody3 style={styles.text}>{children}</AppTextBody3>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    appCheckboxView: {
      flexDirection: 'row',
      marginTop: wp('2%'),
      marginBottom: wp('2%'),
    },
    checkbox: {
      marginLeft: wp('2%'),
      marginRight: wp('2%'),
    },
    text: {
      alignSelf: 'center',
    },
    textContainer: {
      paddingRight: wp('2%'),
      alignSelf: 'center',
      flex: 1,
    },
  });
