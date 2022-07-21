import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppIconBanner from 'enevti-app/components/molecules/AppIconBanner';
import { MINIMUM_BASIC_UNIT_STAKE_ELIGIBILITY } from 'enevti-app/service/enevti/profile';
import { getCoinName } from 'enevti-app/utils/constant/identifier';

type Props = StackScreenProps<RootStackParamList, 'UsernameRegistered'>;

export default function UsernameRegistered({ navigation, route }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
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
        <View style={{ height: hp('5%', insets) }} />

        <AppPrimaryButton onPress={() => handleFormSubmit()} style={styles.createAccount}>
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
