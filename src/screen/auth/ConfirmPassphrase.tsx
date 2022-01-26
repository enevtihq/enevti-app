import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import AppCheckbox from '../../components/atoms/form/AppCheckbox';
import AppPassphraseBox from '../../components/organism/AppPassphraseBox';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import { setEncryptedPassphraseAuth } from '../../store/slices/auth';
import { setLocalSessionKey } from '../../store/slices/session';

type Props = StackScreenProps<RootStackParamList, 'ConfirmPassphrase'>;

export default function ConfirmPassphrase({ route, navigation }: Props) {
  const { passphrase, encryptedPassphrase, localKey } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleContinue = async () => {
    dispatch(setEncryptedPassphraseAuth(encryptedPassphrase));
    dispatch(setLocalSessionKey(localKey));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AccountCreated' }],
      }),
    );
  };

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
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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