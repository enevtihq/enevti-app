import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Keyboard,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
// import * as Lisk from '@liskhq/lisk-client';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppIconGradient from '../components/molecules/AppIconGradient';
import AppFormSecureTextInput from '../components/organism/AppFormSecureTextInput';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppView from '../components/atoms/view/AppView';
import AppCheckbox from '../components/atoms/form/AppCheckbox';
import { BRAND_NAME } from '../components/atoms/brand/AppBrandConstant';

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
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const confirmPasswordInput = React.useRef<any>();

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
          image={
            <AppIconGradient
              name={iconMap.key}
              size={wp('25%')}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.headerImage}
            />
          }
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
          onSubmit={values => console.log(values)}
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
                  showError={values.password !== '' || touched.password}
                  touchHandler={() => setFieldTouched('password')}
                  onChangeText={handleChange('password')}
                  onSubmitEditing={() => confirmPasswordInput.current.focus()}
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
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              <View style={styles.actionContainer}>
                <View style={{ height: hp('3%') }} />

                <AppPrimaryButton
                  onPress={handleSubmit}
                  disabled={!(isValid && dirty)}
                  style={styles.createAccount}>
                  {t('auth:createAcc')}
                </AppPrimaryButton>

                <AppCheckbox
                  status={values.checkboxPassword ? 'checked' : 'unchecked'}
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

const makeStyle = (theme: Theme) =>
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
      marginBottom: hp('4%'),
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    createAccount: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    header: {
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    headerImage: {
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
