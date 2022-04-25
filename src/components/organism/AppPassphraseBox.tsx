import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import Color from 'color';

import { Theme } from 'enevti-app/theme/default';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

interface AppPassphraseBoxProps {
  passphrase: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppPassphraseBox({ passphrase, style }: AppPassphraseBoxProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  return (
    <View style={styles.container}>
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          Clipboard.setString(passphrase);
          dispatch(showSnackbar({ mode: 'info', text: t('form:passphraseCopied') }));
        }}
        style={[styles.touchBox, style]}>
        <View style={[styles.box]}>
          <View style={styles.textBox}>
            <AppTextHeading1 style={styles.text}>{passphrase}</AppTextHeading1>
          </View>
          <AppTextBody5 style={styles.subText}>Tap to Copy</AppTextBody5>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
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
        ? Color(theme.colors.background).lighten(0.6).rgb().toString()
        : Color(theme.colors.background).darken(0.12).rgb().toString(),
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
