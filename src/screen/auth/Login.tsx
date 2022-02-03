import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useDispatch, useSelector } from 'react-redux';

import {
  decryptWithPassword,
  encryptWithDevice,
} from '../../utils/cryptography';
import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormSecureTextInput from '../../components/organism/AppFormSecureTextInput';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import AppCheckbox from '../../components/atoms/form/AppCheckbox';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import AppBrandLogo from '../../components/atoms/brand/AppBrandLogo';
import { RootState } from '../../store/state';
import { setLocalSessionKey } from '../../store/slices/session';
import {
  selectAuthState,
  setUnencryptedPassphraseAuth,
} from '../../store/slices/auth';
import { showSnackbar } from '../../store/slices/ui/global';

type Props = StackScreenProps<RootStackParamList, 'Login'>;
YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
});

export default function Login({ navigation }: Props) {
  const authState = useSelector((state: RootState) => selectAuthState(state));
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const decrypted = await decryptWithPassword(
      authState.token,
      values.password,
    );
    if (decrypted.status === 'error') {
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
    navigation.replace('Home');
  };

  return (
    <AppView dismissKeyboard={true}>
      <AppHeaderWizard
        image={
          <AppBrandLogo
            mode={'glow'}
            widthPercentage={0.4}
            style={styles.headerImage}
          />
        }
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
                label={t('auth:inputPassword')}
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
              <View style={{ height: hp('3%', insets) }} />

              <AppPrimaryButton
                onPress={handleSubmit}
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

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
      flexDirection: 'column-reverse',
    },
    checkbox: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
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
      alignSelf: 'center',
    },
    passwordView: {
      flex: 1,
    },
    passwordInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
