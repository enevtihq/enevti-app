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

import {
  encryptWithDevice,
  encryptWithPassword,
} from '../../utils/cryptography';
import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormSecureTextInput from '../../components/organism/AppFormSecureTextInput';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import AppCheckbox from '../../components/atoms/form/AppCheckbox';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import { BRAND_NAME } from '../../components/atoms/brand/AppBrandConstant';
import { setSecretAppData } from '../../service/google/appData';
import { useDispatch } from 'react-redux';
import { setUnencryptedPassphraseAuth } from '../../store/slices/auth';
import { CommonActions } from '@react-navigation/native';

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
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirmPasswordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const passphrase = Lisk.passphrase.Mnemonic.generateMnemonic();
    const encryptedPassphrase = await encryptWithPassword(
      passphrase,
      values.password,
    );
    const bindedPassphrase = await encryptWithDevice(passphrase);
    await setSecretAppData({
      device: bindedPassphrase,
      encrypted: encryptedPassphrase,
    });
    dispatch(setUnencryptedPassphraseAuth(bindedPassphrase));
    console.log(passphrase);

    setIsLoading(false);

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
          back
          navigation={navigation}
          mode={'emoji'}
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
            handleSubmit,
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
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.actionContainer}>
                <View style={{ height: hp('3%', insets) }} />

                <AppPrimaryButton
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!(isValid && dirty)}
                  style={styles.createAccount}>
                  {t('auth:createAcc')}
                </AppPrimaryButton>

                <AppCheckbox
                  value={values.checkboxPassword}
                  style={styles.checkbox}
                  onPress={() =>
                    setFieldValue('checkboxPassword', !values.checkboxPassword)
                  }>
                  {t('auth:checkboxPassword', { brand: BRAND_NAME })}
                </AppCheckbox>
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
      flex: 0.8,
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
