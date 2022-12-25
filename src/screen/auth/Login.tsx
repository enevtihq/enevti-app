import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useDispatch, useSelector } from 'react-redux';

import { decryptWithPassword, encryptWithDevice } from 'enevti-app/utils/cryptography';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { RootStackParamList } from 'enevti-app/navigation';
import AppFormSecureTextInput from 'enevti-app/components/organism/form/AppFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppCheckbox from 'enevti-app/components/atoms/form/AppCheckbox';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppBrandLogo from 'enevti-app/components/atoms/brand/AppBrandLogo';
import { setLocalSessionKey, selectLocalSession } from 'enevti-app/store/slices/session/local';
import { selectAuthState, setUnencryptedPassphraseAuth } from 'enevti-app/store/slices/auth';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { selectLockedState, unlockScreen } from 'enevti-app/store/slices/ui/screen/locked';
import { isValidPassphrase } from 'enevti-app/utils/passphrase';
import { hostnameToRoute } from 'enevti-app/utils/linking';
import { CommonActions } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Login'>;
YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
});

export default function Login({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);

  const authState = useSelector(selectAuthState);
  const localSession = useSelector(selectLocalSession);
  const locked = useSelector(selectLockedState);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const decrypted = await decryptWithPassword(authState.token, values.password, authState.version);
    if (decrypted.status === 'error' || !isValidPassphrase(decrypted.data)) {
      dispatch(showSnackbar({ mode: 'error', text: t('auth:wrongPassword') }));
      setIsLoading(false);
      return;
    }

    if (values.rememberMe) {
      const deviceEncrypted = await encryptWithDevice(decrypted.data);
      dispatch(setUnencryptedPassphraseAuth(deviceEncrypted));
    } else {
      dispatch(setLocalSessionKey(values.password));
    }

    setIsLoading(false);

    if (route.params && route.params.path) {
      const url = new URL(decodeURIComponent(route.params.path));
      const parsedRoute = hostnameToRoute(url.hostname);
      if (parsedRoute) {
        const param: Record<string, any> = {};
        for (const [key, value] of url.searchParams) {
          param[key] = decodeURIComponent(value);
        }
        locked && dispatch(unlockScreen());
        if (navigation.getState().index === 0) {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Home' }, { name: parsedRoute, params: param }],
            }),
          );
        } else {
          navigation.replace(parsedRoute, param);
        }
      }
    } else {
      if (locked) {
        dispatch(unlockScreen());
        navigation.goBack();
      } else {
        navigation.replace('Home');
      }
    }
  };

  React.useEffect(() => {
    if (!authState.encrypted && authState.token !== '') {
      navigation.navigate('Home');
    } else if (!authState.encrypted && authState.token === '') {
      navigation.replace('CreateAccount');
    } else if (authState.encrypted && localSession.key !== '') {
      locked && dispatch(unlockScreen());
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (locked) {
        e.preventDefault();
        Keyboard.dismiss();
      } else {
        navigation.dispatch(e.data.action);
      }
    });
  }, [locked, navigation]);

  return (
    <AppView dismissKeyboard={true}>
      <AppHeaderWizard
        component={<AppBrandLogo mode={'glow'} widthPercentage={0.4} style={styles.headerImage} />}
        title={t('auth:loginHeader')}
        description={t('auth:loginBody')}
      />

      <Formik
        initialValues={{
          password: '',
          rememberMe: false,
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
                label={t('auth:inputPassword')}
                style={styles.passwordInput}
                value={values.password}
                errorText={
                  errors.password ? (values.password.length > 0 ? t('form:password') : t('form:required')) : ''
                }
                showError={touched.password}
                touchHandler={() => setFieldTouched('password')}
                onChangeText={handleChange('password')}
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
                returnKeyType="done"
              />

              <AppCheckbox
                value={values.rememberMe}
                style={styles.checkbox}
                onPress={() => {
                  Keyboard.dismiss();
                  setFieldValue('rememberMe', !values.rememberMe);
                }}>
                {t('auth:rememberMe')}
              </AppCheckbox>
            </View>

            <View style={styles.actionContainer}>
              <View style={{ height: hp('5%') }} />

              <AppPrimaryButton
                onPress={submitForm}
                loading={isLoading}
                disabled={!(isValid && dirty)}
                style={styles.createAccount}>
                {t('auth:loginButton')}
              </AppPrimaryButton>
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
      flexDirection: 'column-reverse',
    },
    checkbox: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
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
      alignSelf: 'center',
    },
    passwordView: {
      flex: 1,
    },
    passwordInput: {
      marginBottom: hp('1%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
