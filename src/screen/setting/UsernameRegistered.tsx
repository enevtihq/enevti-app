import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppIconBanner from 'enevti-app/components/molecules/icon/AppIconBanner';
import { MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY } from 'enevti-app/service/enevti/profile';
import { getCoinName } from 'enevti-app/utils/constant/identifier';

type Props = StackScreenProps<RootStackParamList, 'UsernameRegistered'>;

export default function UsernameRegistered({ navigation, route }: Props) {
  const styles = React.useMemo(() => makeStyles(), []);
  const { t } = useTranslation();

  const handleFormSubmit = React.useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <AppView>
      <AppHeaderWizard
        navigation={navigation}
        mode={'icon'}
        modeData={'cool'}
        title={t('setting:usernameRegisteredTitle', { username: route.params.username })}
        description={t('setting:usernameRegisteredDescription')}
        style={styles.header}
      />

      <View style={styles.briefView}>
        <AppIconBanner name={iconMap.setupPool} style={styles.briefItem}>
          {t('setting:usernameRegisteredBrief1')}
        </AppIconBanner>
        <AppIconBanner name={iconMap.stake} style={styles.briefItem}>
          {t('setting:usernameRegisteredBrief2', {
            minStake: MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY,
            symbol: getCoinName(),
          })}
        </AppIconBanner>
        <AppIconBanner name={iconMap.username} style={styles.briefItem}>
          {t('setting:usernameRegisteredBrief3')}
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
