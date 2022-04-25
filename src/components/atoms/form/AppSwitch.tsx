import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Switch, TouchableRipple, useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppSwitchProps {
  children: React.ReactNode;
  value: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

export default function AppSwitch({ children, value, style, disabled, onPress }: AppSwitchProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  return (
    <View style={[style]}>
      <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" onPress={onPress}>
        <View style={styles.appCheckboxView}>
          <View style={styles.textContainer}>
            <AppTextBody4 style={styles.text}>{children}</AppTextBody4>
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
      paddingLeft: wp('2%', insets),
      alignSelf: 'center',
      flex: 1,
    },
  });
