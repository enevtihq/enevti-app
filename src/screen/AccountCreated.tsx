import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppView from '../components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from '../utils/imageRatio';
import AppTextBody3 from '../components/atoms/text/AppTextBody3';
import AppIconBanner from '../components/molecules/AppIconBanner';
import { BRAND_NAME } from '../components/atoms/brand/AppBrandConstant';

type Props = StackScreenProps<RootStackParamList, 'AccountCreated'>;

export default function AccountCreated({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();

  const handleFormSubmit = async () => {};

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        <AppHeaderWizard
          navigation={navigation}
          mode={'emoji'}
          modeData={'accountCreated'}
          title={t('auth:accountCreated')}
          description={t('auth:accountCreatedBrief')}
          style={styles.header}
        />

        <View style={styles.briefView}>
          <AppIconBanner name={iconMap.passphrase} style={styles.briefItem}>
            {t('auth:keepYourPassphraseSafe')}
            <AppTextBody3 style={styles.boldText}>
              {t('auth:keepYourPassphraseSafeBold', { brand: BRAND_NAME })}
            </AppTextBody3>
          </AppIconBanner>
          <AppIconBanner name={iconMap.accountCircle} style={styles.briefItem}>
            {t('auth:findYourPassphrase')}
            <AppTextBody3 style={styles.boldText}>
              {t('auth:findYourPassphraseBold')}
            </AppTextBody3>
          </AppIconBanner>
          <AppIconBanner name={iconMap.insideDevice} style={styles.briefItem}>
            {t('auth:passwordNeverLeaveDevice')}
            <AppTextBody3 style={styles.boldText}>
              {t('auth:passwordNeverLeaveDeviceBold')}
            </AppTextBody3>
          </AppIconBanner>
        </View>

        <View style={styles.actionContainer}>
          <View style={{ height: hp('3%', insets) }} />

          <AppPrimaryButton
            onPress={() => handleFormSubmit()}
            style={styles.createAccount}>
            {t('auth:createAccountDoneButton')}
          </AppPrimaryButton>
        </View>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
      flex: 0.7,
      flexDirection: 'column-reverse',
    },
    boldText: {
      fontWeight: 'bold',
    },
    briefItem: {
      marginBottom: hp('2%', insets),
    },
    briefView: {
      flex: 1,
      alignItems: 'center',
      paddingLeft: wp('12%', insets),
      paddingRight: wp('12%', insets),
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
    header: {
      flex: 1,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    headerImage: {
      alignSelf: 'center',
    },
  });
