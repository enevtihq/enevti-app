import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Checkbox, useTheme } from 'react-native-paper';
import AppTextBody3 from '../text/AppTextBody3';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface AppCheckboxProps {
  children: React.ReactNode;
  status: 'checked' | 'unchecked' | 'indeterminate';
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  uncheckedColor?: string;
}

export default function AppCheckbox({
  children,
  status,
  style,
  disabled,
  onPress,
  uncheckedColor,
}: AppCheckboxProps) {
  const theme = useTheme();
  const styles = makeStyle();

  return (
    <View style={[styles.appCheckboxView, style]}>
      <View style={styles.checkbox}>
        <Checkbox
          status={status}
          disabled={disabled}
          onPress={onPress}
          uncheckedColor={uncheckedColor}
          color={theme.colors.primary}
          theme={theme}
        />
      </View>
      <AppTextBody3 style={styles.text}>{children}</AppTextBody3>
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    appCheckboxView: {
      flexDirection: 'row',
    },
    checkbox: {
      marginRight: wp('2%'),
    },
    text: {
      alignSelf: 'center',
    },
  });
