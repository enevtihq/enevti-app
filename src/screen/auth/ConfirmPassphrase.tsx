import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import AppPassphraseBox from 'enevti-app/components/organism/auth/AppPassphraseBox';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { initPassphrase } from 'enevti-app/store/middleware/thunk/session/initPassphrase';

type Props = StackScreenProps<RootStackParamList, 'ConfirmPassphrase'>;

export default function ConfirmPassphrase({ route, navigation }: Props) {
  const { passphrase, encryptedPassphrase, localKey } = route.params;
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleContinue = async () => {
    dispatch(initPassphrase(encryptedPassphrase, passphrase, localKey));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AccountCreated' }],
      }),
    );
  };

  return (
    <AppView>
      <AppHeaderWizard
        navigation={navigation}
        mode={'icon'}
        modeData={'passphrase'}
        title={t('auth:confirmPasspraseHeader')}
        description={t('auth:confirmPassphraseBody')}
        style={styles.header}
      />

      <View style={styles.passphraseView}>
        <AppPassphraseBox passphrase={passphrase} style={styles.passphraseBox} />
      </View>

      <View style={styles.actionContainer}>
        <View style={{ height: hp('5%') }} />

        <AppPrimaryButton onPress={() => handleContinue()} disabled={!checked} style={styles.createAccount}>
          {t('auth:continue')}
        </AppPrimaryButton>

        <AppCheckbox value={checked} style={styles.checkbox} onPress={() => setChecked(!checked)}>
          {t('auth:confirmPassphraseCheck')}
        </AppCheckbox>
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
    checkbox: {
      marginBottom: hp('2%'),
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
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
      fontSize: wp('25%'),
      alignSelf: 'center',
    },
    passphraseView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: wp('7%'),
      paddingRight: wp('7%'),
    },
    passphraseBox: {},
  });
