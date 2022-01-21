import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import color from 'color';

import { Theme } from '../../theme/default';
import AppTextHeading1 from '../atoms/text/AppTextHeading1';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

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

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    box: {
      width: '100%',
      height: '100%',
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
      marginLeft: wp('10%', insets),
      marginRight: wp('10%', insets),
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subText: {
      textAlign: 'center',
      marginTop: wp('3%', insets),
      marginBottom: wp('3%', insets),
    },
  });
