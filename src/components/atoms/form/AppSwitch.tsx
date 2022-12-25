import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Switch, TouchableRipple, useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { wp } from 'enevti-app/utils/layout/imageRatio';

interface AppSwitchProps {
  children: React.ReactNode;
  value: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

export default function AppSwitch({ children, value, style, disabled, onPress }: AppSwitchProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);

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

const makeStyles = () =>
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
      alignSelf: 'flex-start',
    },
    textContainer: {
      paddingRight: wp('2%'),
      paddingLeft: wp('2%'),
      alignSelf: 'center',
      flex: 1,
    },
  });
