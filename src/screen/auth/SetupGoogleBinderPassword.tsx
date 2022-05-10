import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { encryptWithDevice, encryptWithPassword } from 'enevti-app/utils/cryptography';
import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormSecureTextInput from 'enevti-app/components/organism/AppFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { COMMUNITY_IDENTIFIER } from 'enevti-app/utils/constant/identifier';
import { setSecretAppData } from 'enevti-app/service/google/appData';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { handleError } from 'enevti-app/utils/error/handle';
import { initPassphraseWithDevice } from 'enevti-app/store/middleware/thunk/session/initPassphraseWithDevice';
import { generatePassphrase } from 'enevti-app/utils/passphrase';

type Props = StackScreenProps<RootStackParamList, 'SetupGoogleBinderPassword'>;
YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required(),
  checkboxPassword: Yup.bool().oneOf([true]),
});

export default function SetupGoogleBinderPassword({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirmPasswordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    try {
      const passphrase = generatePassphrase();
      const encryptedPassphrase = await encryptWithPassword(passphrase, values.password);
      const bindedPassphrase = await encryptWithDevice(passphrase);
      await setSecretAppData({
        device: bindedPassphrase,
        encrypted: encryptedPassphrase,
      });
      dispatch(initPassphraseWithDevice(bindedPassphrase, passphrase));

      setIsLoading(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AccountCreated' }],
        }),
      );
    } catch (err: any) {
      handleError(err);
      setIsLoading(false);
    }
  };

  return (
    <AppView dismissKeyboard={true}>
      <AppHeaderWizard
        back
        navigation={navigation}
        mode={'icon'}
        modeData={'binderPassword'}
        title={t('auth:binderPasswordHeader')}
        description={t('auth:binderPasswordBody')}
        style={styles.header}
      />

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          checkboxPassword: false,
        }}
        onSubmit={async values => {
          setIsLoading(true);
          await handleFormSubmit(values);
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          submitForm,
          setFieldTouched,
          setFieldValue,
          values,
          errors,
          isValid,
          dirty,
          touched,
        }) => (
          <>
            <View style={styles.passwordView}>
              <AppFormSecureTextInput
                label={t('auth:newBinderPassword')}
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
                label={t('auth:confirmBinderPassword')}
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
                onSubmitEditing={isValid && dirty ? submitForm : () => Keyboard.dismiss()}
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.actionContainer}>
              <View style={{ height: hp('3%', insets) }} />

              <AppPrimaryButton
                onPress={submitForm}
                loading={isLoading}
                disabled={!(isValid && dirty)}
                style={styles.createAccount}>
                {t('auth:createAcc')}
              </AppPrimaryButton>

              <AppCheckbox
                value={values.checkboxPassword}
                style={styles.checkbox}
                onPress={() => setFieldValue('checkboxPassword', !values.checkboxPassword)}>
                {t('auth:checkboxPassword', { brand: COMMUNITY_IDENTIFIER })}
              </AppCheckbox>
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
      flex: 0.8,
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
      fontSize: wp('20%', insets),
      alignSelf: 'center',
    },
    passwordView: {
      flex: 1,
    },
    passwordInput: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
