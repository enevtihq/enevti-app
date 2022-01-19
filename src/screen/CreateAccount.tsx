import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Theme } from '../theme/default';
import AppBrandBanner from '../components/molecules/AppBrandBanner';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import AppTextBody4 from '../components/atoms/text/AppTextBody4';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppSecondaryButton from '../components/atoms/button/AppSecondaryButton';
import AppTextBody3 from '../components/atoms/text/AppTextBody3';
import AppTertiaryButton from '../components/atoms/button/AppTertiaryButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';

type Props = StackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
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
          onPress={() => navigation.navigate('SetupLocalPassword')}
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
          icon={iconMap.google}
          style={styles.createAccount}>
          {t('auth:socialLogin')}
        </AppTertiaryButton>
      </View>
    </SafeAreaView>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    createAccount: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    headerImage: {
      alignSelf: 'center',
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
    orView: {
      flexDirection: 'row',
      alignSelf: 'center',
      margin: 8,
    },
    term: {
      alignSelf: 'center',
      color: theme.colors.placeholder,
    },
  });
