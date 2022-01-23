import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Switch, TouchableRipple, useTheme } from 'react-native-paper';
import AppTextBody3 from '../text/AppTextBody3';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppSwitchProps {
  children: React.ReactNode;
  value: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
}

export default function AppSwitch({
  children,
  value,
  style,
  disabled,
  onPress,
}: AppSwitchProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  return (
    <View style={[style]}>
      <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" onPress={onPress}>
        <View style={styles.appCheckboxView}>
          <View style={styles.textContainer}>
            <AppTextBody3 style={styles.text}>{children}</AppTextBody3>
          </View>
          <View style={styles.checkbox}>
            <Switch
              value={value}
              disabled={disabled}
              color={theme.colors.primary}
              onValueChange={onPress}
              theme={theme}
            />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
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
      paddingLeft: wp('2%', insets),
      alignSelf: 'center',
      flex: 1,
    },
  });
