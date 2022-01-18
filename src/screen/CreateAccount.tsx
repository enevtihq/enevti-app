import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Theme } from '../theme/default';
import AppBrandBanner from '../components/molecules/AppBrandBanner';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import AppTextBody4 from '../components/atoms/AppTextBody4';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppPrimaryButton from '../components/atoms/AppPrimaryButton';
import AppSecondaryButton from '../components/atoms/AppSecondaryButton';
import AppTextBody3 from '../components/atoms/AppTextBody3';
import AppTertiaryButton from '../components/atoms/AppTertiaryButton';

export default function CreateAccount() {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <AppHeaderWizard
        image={
          <AppBrandBanner widthPercentage={0.5} style={styles.headerImage} />
        }
        title={t('auth:header1')}
        description={t('auth:body1')}
      />

      <View style={styles.actionContainer}>
        <View style={{ height: hp('3%') }} />
        <AppTextBody4 style={styles.term}>{t('auth:term')}</AppTextBody4>
        <View style={{ height: hp('4%') }} />

        <AppSecondaryButton
          onPress={() => console.log('pressed')}
          style={styles.createAccount}>
          {t('auth:importPassphrase')}
        </AppSecondaryButton>

        <AppPrimaryButton
          onPress={() => console.log('pressed')}
          style={styles.createAccount}>
          {t('auth:createAccount')}
        </AppPrimaryButton>

        <View style={styles.orView}>
          <View style={styles.orLine} />
          <AppTextBody3
            style={{ color: theme.colors.placeholder, marginBottom: hp('2%') }}>
            {t('auth:or')}
          </AppTextBody3>
          <View style={styles.orLine} />
        </View>

        <AppTertiaryButton
          onPress={() => console.log('pressed')}
          icon="google"
          style={styles.createAccount}>
          {t('auth:socialLogin')}
        </AppTertiaryButton>
      </View>
    </SafeAreaView>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    headerImage: {
      alignSelf: 'center',
    },
    term: {
      alignSelf: 'center',
      color: theme.colors.placeholder,
    },
    createAccount: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    orView: {
      flexDirection: 'row',
      alignSelf: 'center',
      margin: 8,
    },
    orLine: {
      backgroundColor: theme.colors.placeholder,
      height: 1,
      width: wp('7%'),
      alignSelf: 'center',
      marginLeft: wp('2%'),
      marginRight: wp('2%'),
      marginBottom: hp('2%'),
    },
  });
