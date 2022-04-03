import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import AppPassphraseBox from 'enevti-app/components/organism/AppPassphraseBox';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { initPassphrase } from 'enevti-app/store/middleware/thunk/session/initPassphrase';

type Props = StackScreenProps<RootStackParamList, 'ConfirmPassphrase'>;

export default function ConfirmPassphrase({ route, navigation }: Props) {
  const { passphrase, encryptedPassphrase, localKey } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleContinue = async () => {
    dispatch(initPassphrase(encryptedPassphrase, localKey));
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
        mode={'emoji'}
        modeData={'passphrase'}
        title={t('auth:confirmPasspraseHeader')}
        description={t('auth:confirmPassphraseBody')}
        style={styles.header}
      />

      <View style={styles.passphraseView}>
        <AppPassphraseBox
          passphrase={passphrase}
          style={styles.passphraseBox}
        />
      </View>

      <View style={styles.actionContainer}>
        <View style={{ height: hp('3%', insets) }} />

        <AppPrimaryButton
          onPress={() => handleContinue()}
          disabled={!checked}
          style={styles.createAccount}>
          {t('auth:continue')}
        </AppPrimaryButton>

        <AppCheckbox
          value={checked}
          style={styles.checkbox}
          onPress={() => setChecked(!checked)}>
          {t('auth:confirmPassphraseCheck')}
        </AppCheckbox>
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
    checkbox: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
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
      fontSize: wp('25%', insets),
      alignSelf: 'center',
    },
    passphraseView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: wp('7%', insets),
      paddingRight: wp('7%', insets),
    },
    passphraseBox: {},
  });
