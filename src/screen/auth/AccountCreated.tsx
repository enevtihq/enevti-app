import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppIconBanner from 'enevti-app/components/molecules/AppIconBanner';
import { BRAND_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';

type Props = StackScreenProps<RootStackParamList, 'AccountCreated'>;

export default function AccountCreated({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const { t } = useTranslation();

  const handleFormSubmit = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  return (
    <AppView>
      <AppHeaderWizard
        navigation={navigation}
        mode={'icon'}
        modeData={'accountCreated'}
        title={t('auth:accountCreated')}
        description={t('auth:accountCreatedBrief')}
        style={styles.header}
      />

      <View style={styles.briefView}>
        <AppIconBanner name={iconMap.passphrase} style={styles.briefItem}>
          {t('auth:keepYourPassphraseSafe')}
          <AppTextBody4 style={styles.boldText}>
            {t('auth:keepYourPassphraseSafeBold', { brand: BRAND_NAME })}
          </AppTextBody4>
        </AppIconBanner>
        <AppIconBanner name={iconMap.accountCircle} style={styles.briefItem}>
          {t('auth:findYourPassphrase')}
          <AppTextBody4 style={styles.boldText}>
            {t('auth:findYourPassphraseBold')}
          </AppTextBody4>
        </AppIconBanner>
        <AppIconBanner name={iconMap.insideDevice} style={styles.briefItem}>
          {t('auth:passwordNeverLeaveDevice')}
          <AppTextBody4 style={styles.boldText}>
            {t('auth:passwordNeverLeaveDeviceBold')}
          </AppTextBody4>
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
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
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
