import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import color from 'color';

import { Theme } from '../../theme/default';
import AppTextHeading1 from '../atoms/text/AppTextHeading1';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';
import AppSnackbar from '../atoms/snackbar/AppSnackbar';

interface AppPassphraseBoxProps {
  passphrase: string;
  style?: ViewStyle;
}

export default function AppPassphraseBox({
  passphrase,
  style,
}: AppPassphraseBoxProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const [snackVisible, setSnackVisible] = React.useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          Clipboard.setString(passphrase);
          setSnackVisible(true);
        }}
        style={[styles.touchBox, style]}>
        <View style={[styles.box]}>
          <View style={styles.textBox}>
            <AppTextHeading1 style={styles.text}>{passphrase}</AppTextHeading1>
          </View>
          <AppTextBody4 style={styles.subText}>Tap to Copy</AppTextBody4>
        </View>
      </TouchableRipple>
      <AppSnackbar
        mode={'info'}
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={1500}>
        {t('form:passphraseCopied')}
      </AppSnackbar>
    </View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.roundness,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
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
    snackText: {
      color: theme.dark ? 'black' : 'white',
    },
  });
