import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Theme } from '../theme/default';
import AppBrandBanner from '../components/molecules/AppBrandBanner';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import AppTextBody4 from '../components/atoms/text/AppTextBody4';
import { hp, wp, SafeAreaInsets } from '../utils/imageRatio';

import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppSecondaryButton from '../components/atoms/button/AppSecondaryButton';
import AppTextBody3 from '../components/atoms/text/AppTextBody3';
import AppTertiaryButton from '../components/atoms/button/AppTertiaryButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppView from '../components/atoms/view/AppView';

type Props = StackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();

  console.log(insets);

  return (
    <AppView>
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
          <View style={{ height: hp('3%', insets) }} />
          <AppTextBody4 style={styles.term}>{t('auth:term')}</AppTextBody4>
          <View style={{ height: hp('4%', insets) }} />

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
              style={{
                color: theme.colors.placeholder,
                marginBottom: hp('2%', insets),
              }}>
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
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
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
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    headerImage: {
      alignSelf: 'center',
    },
    orLine: {
      backgroundColor: theme.colors.placeholder,
      height: 1,
      width: wp('7%', insets),
      alignSelf: 'center',
      marginLeft: wp('2%', insets),
      marginRight: wp('2%', insets),
      marginBottom: hp('2%', insets),
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
