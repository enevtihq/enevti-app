import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Checkbox, TouchableRipple, useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppCheckboxProps {
  children: React.ReactNode;
  value: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  uncheckedColor?: string;
}

export default function AppCheckbox({ children, value, style, disabled, onPress, uncheckedColor }: AppCheckboxProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

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
            <AppTextBody4 style={styles.text}>{children}</AppTextBody4>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    appCheckboxView: {
      flexDirection: 'row',
      marginTop: wp('2%', insets),
      marginBottom: wp('2%', insets),
    },
    checkbox: {
      marginLeft: wp('2%', insets),
      marginRight: wp('2%', insets),
    },
    text: {
      alignSelf: 'flex-start',
    },
    textContainer: {
      paddingRight: wp('2%', insets),
      alignSelf: 'center',
      flex: 1,
    },
  });
