import React from 'react';
import { StyleSheet, StatusBar, View, Keyboard } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import * as Lisk from '@liskhq/lisk-client';

import { encryptWithPassword } from '../../utils/cryptography';
import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormSecureTextInput from '../../components/organism/AppFormSecureTextInput';
import AppFormTextInputWithError from '../../components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';

type Props = StackScreenProps<RootStackParamList, 'SetupLocalPassword'>;
YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required(),
});

export default function ImportPassphrase({ navigation }: Props) {
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();
  const passwordInput = React.useRef<any>();
  const confirmPasswordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const passphrase = Lisk.passphrase.Mnemonic.generateMnemonic();
    const encryptedPassphrase = await encryptWithPassword(
      passphrase,
      values.password,
    );
    setIsLoading(false);
    navigation.replace('ConfirmPassphrase', {
      passphrase,
      encryptedPassphrase,
      localKey: values.password,
    });
  };

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        <AppHeaderWizard
          back
          navigation={navigation}
          mode={'emoji'}
          modeData={'importAccount'}
          title={t('auth:importAccountHeader')}
          description={t('auth:importAccountBody')}
          style={styles.header}
        />

        <Formik
          initialValues={{
            passphrase: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async values => {
            setIsLoading(true);
            await handleFormSubmit(values);
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            handleSubmit,
            setFieldTouched,
            values,
            errors,
            isValid,
            dirty,
            touched,
          }) => (
            <>
              <View style={styles.passwordView}>
                <AppFormTextInputWithError
                  label={t('auth:secretRecoveryPhrase')}
                  theme={paperTheme}
                  multiline={true}
                  style={styles.passwordInput}
                  value={values.passphrase}
                  errorText={''}
                  showError={values.password !== '' || touched.password}
                  onChangeText={handleChange('passphrase')}
                  onSubmitEditing={() => passwordInput.current.focus()}
                  blurOnSubmit={true}
                  returnKeyType="go"
                />
                <AppFormSecureTextInput
                  ref={passwordInput}
                  label={t('auth:newLocalPassword')}
                  style={styles.passwordInput}
                  value={values.password}
                  errorText={
                    errors.password
                      ? values.password.length > 0
                        ? t('form:password')
                        : t('form:required')
                      : ''
                  }
                  showError={values.password !== '' || touched.password}
                  touchHandler={() => setFieldTouched('password')}
                  onChangeText={handleChange('password')}
                  onSubmitEditing={() => confirmPasswordInput.current.focus()}
                  blurOnSubmit={true}
                  returnKeyType="go"
                />
                <AppFormSecureTextInput
                  ref={confirmPasswordInput}
                  label={t('auth:confirmLocalPassword')}
                  style={styles.passwordInput}
                  value={values.confirmPassword}
                  errorText={
                    errors.confirmPassword
                      ? values.confirmPassword.length > 0
                        ? t('form:passwordMatch')
                        : t('form:required')
                      : ''
                  }
                  showError={
                    values.confirmPassword !== '' || touched.confirmPassword
                  }
                  touchHandler={() => setFieldTouched('confirmPassword')}
                  onChangeText={handleChange('confirmPassword')}
                  onSubmitEditing={
                    isValid && dirty ? handleSubmit : () => Keyboard.dismiss()
                  }
                />
              </View>

              <View style={styles.actionContainer}>
                <View style={{ height: hp('3%', insets) }} />

                <AppPrimaryButton
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!(isValid && dirty)}
                  style={styles.createAccount}>
                  {t('auth:import')}
                </AppPrimaryButton>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
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
    header: {
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('5%', insets),
    },
    headerImage: {
      fontSize: wp('20%', insets),
      alignSelf: 'center',
    },
    passphraseInput: {
      height: hp('20%', insets),
    },
    passwordView: {
      flex: 2,
    },
    passwordInput: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
