import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import color from 'color';

import { Theme } from '../../theme/default';
import AppTextHeading1 from '../atoms/text/AppTextHeading1';
import AppTextBody4 from '../atoms/text/AppTextBody4';

interface AppPassphraseBoxProps {
  passphrase: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function AppPassphraseBox({
  passphrase,
  onPress,
  style,
}: AppPassphraseBoxProps) {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={onPress}
        style={[styles.touchBox, style]}>
        <View style={[styles.box]}>
          <View style={styles.textBox}>
            <AppTextHeading1 style={styles.text}>{passphrase}</AppTextHeading1>
          </View>
          <AppTextBody4 style={styles.subText}>Tap to Copy</AppTextBody4>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    box: {
      width: wp('80%'),
      height: wp('80%'),
    },
    touchBox: {
      backgroundColor: theme.dark
        ? color(theme.colors.background).lighten(0.6).rgb().toString()
        : color(theme.colors.background).darken(0.12).rgb().toString(),
    },
    text: {
      textAlign: 'center',
    },
    textBox: {
      flex: 1,
      marginLeft: wp('10%'),
      marginRight: wp('10%'),
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subText: {
      textAlign: 'center',
      marginTop: wp('3%'),
      marginBottom: wp('3%'),
    },
  });
