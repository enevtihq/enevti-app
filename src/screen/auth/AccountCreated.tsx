import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppIconBanner from 'enevti-app/components/molecules/icon/AppIconBanner';
import { COMMUNITY_IDENTIFIER } from 'enevti-app/utils/constant/identifier';

type Props = StackScreenProps<RootStackParamList, 'AccountCreated'>;

export default function AccountCreated({ navigation }: Props) {
  const styles = React.useMemo(() => makeStyles(), []);
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
            {t('auth:keepYourPassphraseSafeBold', {
              brand: COMMUNITY_IDENTIFIER,
            })}
          </AppTextBody4>
        </AppIconBanner>
        <AppIconBanner name={iconMap.accountCircle} style={styles.briefItem}>
          {t('auth:findYourPassphrase')}
          <AppTextBody4 style={styles.boldText}>{t('auth:findYourPassphraseBold')}</AppTextBody4>
        </AppIconBanner>
        <AppIconBanner name={iconMap.insideDevice} style={styles.briefItem}>
          {t('auth:passwordNeverLeaveDevice')}
          <AppTextBody4 style={styles.boldText}>{t('auth:passwordNeverLeaveDeviceBold')}</AppTextBody4>
        </AppIconBanner>
      </View>

      <View style={styles.actionContainer}>
        <View style={{ height: hp('5%') }} />

        <AppPrimaryButton onPress={() => handleFormSubmit()} style={styles.createAccount}>
          {t('auth:createAccountDoneButton')}
        </AppPrimaryButton>
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    actionContainer: {
      flex: 0.7,
      flexDirection: 'column-reverse',
    },
    boldText: {
      fontWeight: 'bold',
    },
    briefItem: {
      marginBottom: hp('2%'),
    },
    briefView: {
      flex: 1,
      alignItems: 'center',
      paddingLeft: wp('12%'),
      paddingRight: wp('12%'),
    },
    createAccount: {
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    header: {
      flex: 1,
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    headerImage: {
      alignSelf: 'center',
    },
  });
