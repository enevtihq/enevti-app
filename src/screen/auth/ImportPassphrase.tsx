import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { encryptWithPassword } from 'enevti-app/utils/cryptography';
import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormSecureTextInput from 'enevti-app/components/organism/AppFormSecureTextInput';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import YupBIP39 from 'enevti-app/utils/yupbip39';
import { useDispatch } from 'react-redux';
import { initPassphrase } from 'enevti-app/store/middleware/thunk/session/initPassphrase';

type Props = StackScreenProps<RootStackParamList, 'SetupLocalPassword'>;
YupPassword(Yup);
YupBIP39(Yup);

const validationSchema = Yup.object().shape({
  passphrase: Yup.string().bip39().required(),
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required(),
});

export default function ImportPassphrase({ navigation }: Props) {
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const { t } = useTranslation();
  const passwordInput = React.useRef<any>();
  const confirmPasswordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const encryptedPassphrase = await encryptWithPassword(
      values.passphrase,
      values.password,
    );
    dispatch(
      initPassphrase(encryptedPassphrase, values.passphrase, values.password),
    );
    setIsLoading(false);
    navigation.replace('AccountCreated');
  };

  return (
    <AppView dismissKeyboard={true}>
      <AppHeaderWizard
        back
        navigation={navigation}
        mode={'icon'}
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
          Keyboard.dismiss();
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
                autoCapitalize={'none'}
                style={styles.passwordInput}
                value={values.passphrase}
                onBlur={() => setFieldTouched('passphrase')}
                errorText={
                  errors.passphrase
                    ? values.passphrase.length > 0
                      ? t('auth:invalidPassphrase')
                      : t('form:required')
                    : ''
                }
                showError={touched.passphrase}
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
                showError={touched.password}
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
                showError={touched.confirmPassword}
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
    </AppView>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
      flexDirection: 'column-reverse',
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
