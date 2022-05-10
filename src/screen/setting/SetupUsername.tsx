import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Theme } from 'enevti-app/theme/default';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import i18n from 'enevti-app/translations/i18n';
import { isUsernameAvailable } from 'enevti-app/service/enevti/setting';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import { useDispatch } from 'react-redux';
import { payRegisterUsername } from 'enevti-app/store/middleware/thunk/payment/creator/payRegisterUsername';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { hideModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

type Props = StackScreenProps<RootStackParamList, 'SetupUsername'>;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(/^[\w]*$/, i18n.t('form:noSpace'))
    .matches(/^[a-z]+$/, i18n.t('form:lowercase'))
    .min(1, i18n.t('form:minChar', { count: 1 }))
    .max(20, i18n.t('form:maxChar', { count: 20 }))
    .required(i18n.t('form:required')),
  checkbox: Yup.bool().oneOf([true]),
});

export default function SetupUsername({ navigation }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const paymentThunkRef = React.useRef<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    paymentThunkRef.current = dispatch(payRegisterUsername(values.username));
  };

  const paymentIdleCallback = React.useCallback(() => {
    setIsLoading(false);
    paymentThunkRef.current?.abort();
  }, []);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
    navigation.replace('UsernameRegistered');
  }, [navigation, dispatch, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  return (
    <AppView withModal withLoader withPayment withSnackbar dismissKeyboard={true}>
      <AppHeaderWizard
        back
        navigation={navigation}
        mode={'icon'}
        modeData={'username'}
        title={t('setting:setupUsername')}
        description={t('setting:setupUsernameDescription')}
        style={styles.header}
      />

      <Formik
        initialValues={{
          username: '',
          checkbox: false,
        }}
        initialStatus={{
          usernameAvailable: false,
          usernameChecked: false,
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
          setStatus,
          setFieldValue,
          values,
          errors,
          isValid,
          dirty,
          touched,
          status,
        }) => (
          <>
            <View style={styles.passwordView}>
              <AppFormTextInputWithError
                theme={theme as any}
                autoCapitalize={'none'}
                label={t('setting:enterUsername')}
                style={styles.passwordInput}
                value={values.username}
                errorText={!status.usernameAvailable ? t('setting:usernameUnavailable') : errors.username}
                error={touched.username && status.usernameChecked && !status.usernameAvailable}
                showError={touched.username && status.usernameChecked}
                onBlur={async () => {
                  setFieldTouched('username');
                  if (values.username.trim()) {
                    const usernameAvailable = await isUsernameAvailable(values.username.trim());
                    setStatus({
                      usernameAvailable,
                      usernameChecked: true,
                    });
                  }
                }}
                onChangeText={handleChange('username')}
                onSubmitEditing={isValid && dirty && status.usernameAvailable ? submitForm : () => Keyboard.dismiss()}
                blurOnSubmit={true}
                returnKeyType="go"
              />
            </View>

            <View style={styles.actionContainer}>
              <View style={{ height: hp('3%', insets) }} />

              <AppPrimaryButton
                onPress={submitForm}
                loading={isLoading}
                disabled={!(isValid && dirty && status.usernameAvailable)}
                style={styles.createAccount}>
                {t('setting:registerUsername')}
              </AppPrimaryButton>

              <AppCheckbox
                value={values.checkbox}
                style={styles.checkbox}
                onPress={() => setFieldValue('checkbox', !values.checkbox)}>
                {t('setting:usernameCheckbox')}
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
