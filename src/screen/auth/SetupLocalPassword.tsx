import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { encryptWithPassword } from 'enevti-app/utils/cryptography';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormSecureTextInput from 'enevti-app/components/organism/form/AppFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { COMMUNITY_IDENTIFIER } from 'enevti-app/utils/constant/identifier';
import { generatePassphrase } from 'enevti-app/utils/passphrase';

type Props = StackScreenProps<RootStackParamList, 'SetupLocalPassword'>;
YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required(),
  checkboxPassword: Yup.bool().oneOf([true]),
});

export default function SetupLocalPassword({ navigation }: Props) {
  const styles = React.useMemo(() => makeStyles(), []);
  const { t } = useTranslation();
  const confirmPasswordInput = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const passphrase = generatePassphrase();
    const encryptedPassphrase = await encryptWithPassword(passphrase, values.password);
    setIsLoading(false);
    navigation.replace('ConfirmPassphrase', {
      passphrase,
      encryptedPassphrase,
      localKey: values.password,
    });
  };

  return (
    <AppView dismissKeyboard={true}>
      <AppHeaderWizard
        back
        navigation={navigation}
        mode={'icon'}
        modeData={'password'}
        title={t('auth:localPasswordHeader')}
        description={t('auth:localPasswordBody')}
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
        {({ handleChange, submitForm, setFieldTouched, setFieldValue, values, errors, isValid, dirty, touched }) => (
          <>
            <View style={styles.passwordView}>
              <AppFormSecureTextInput
                label={t('auth:newLocalPassword')}
                style={styles.passwordInput}
                value={values.password}
                errorText={
                  errors.password ? (values.password.length > 0 ? t('form:password') : t('form:required')) : ''
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
                onSubmitEditing={isValid && dirty ? submitForm : () => Keyboard.dismiss()}
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.actionContainer}>
              <View style={{ height: hp('5%') }} />

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

const makeStyles = () =>
  StyleSheet.create({
    actionContainer: {
      flex: 0.8,
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
      fontSize: wp('20%'),
      alignSelf: 'center',
    },
    passwordView: {
      flex: 1,
    },
    passwordInput: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
