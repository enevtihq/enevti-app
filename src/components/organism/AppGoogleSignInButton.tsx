import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { RootState } from '../../store/state';
import {
  getGoogleAccessToken,
  googleInit,
  googleSignIn,
} from '../../service/google/signIn';
import {
  selectGoogleAPITokenState,
  setGoogleAPIToken,
} from '../../store/slices/session/google';
import { showSnackbar } from '../../store/slices/ui/global';
import AppDialogForm from './AppDialogForm';
import { Dialog } from 'react-native-paper';
import AppFormSecureTextInput from './AppFormSecureTextInput';
import AppPrimaryButton from '../atoms/button/AppPrimaryButton';
import {
  getSecretAppData,
  SecretAppData,
  updateSecretAppData,
} from '../../service/google/appData';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import AppTertiaryButton from '../atoms/button/AppTertiaryButton';
import { iconMap } from '../atoms/icon/AppIconComponent';
import {
  decryptWithDevice,
  decryptWithPassword,
  encryptWithDevice,
} from '../../utils/cryptography';
import { setUnencryptedPassphraseAuth } from '../../store/slices/auth';

YupPassword(Yup);

const validationSchema = Yup.object().shape({
  password: Yup.string().password().required(),
});

interface AppGoogleSignInButtonProps {
  onNewAccount: () => void;
  onExistingAccount: () => void;
}

export default function AppGoogleSignInButton({
  onNewAccount,
  onExistingAccount,
}: AppGoogleSignInButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);
  const apiToken = useSelector((state: RootState) =>
    selectGoogleAPITokenState(state),
  );
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);
  const [showInputGoogleDialog, setShowInputGoogleDialog] =
    React.useState<boolean>(false);
  const [isDialogButtonLoading, setIsDialogButtonLoading] =
    React.useState<boolean>(false);
  const [secretData, setSecretData] = React.useState<SecretAppData>({
    device: '',
    encrypted: '',
  });

  React.useEffect(() => {
    googleInit();
  }, []);

  const handleOnPress = async () => {
    setIsLoadingGoogle(true);

    if (!apiToken) {
      const signInCode = await googleSignIn();
      if (signInCode !== 0) {
        setIsLoadingGoogle(false);
        return;
      }

      const newApiToken = await getGoogleAccessToken();
      dispatch(setGoogleAPIToken(newApiToken));
    }

    const data = await getSecretAppData();
    setSecretData(data);

    if (data.device && data.encrypted) {
      const decrypted = await decryptWithDevice(data.device);
      if (decrypted.status === 'error') {
        setShowInputGoogleDialog(true);
        setIsLoadingGoogle(false);
        return;
      } else {
        dispatch(setUnencryptedPassphraseAuth(data.device));
        await onExistingAccount();
      }
    } else {
      await onNewAccount();
    }

    setIsLoadingGoogle(false);
  };

  const handleDialogFormSubmit = async (values: any) => {
    const decrypted = await decryptWithPassword(
      secretData.encrypted,
      values.password,
    );
    if (decrypted.status === 'error') {
      dispatch(
        showSnackbar({
          mode: 'error',
          text: t('auth:wrongPassword'),
        }),
      );
      setIsDialogButtonLoading(false);
      return;
    } else {
      const newBindedData = await encryptWithDevice(decrypted.data);
      await updateSecretAppData({
        device: newBindedData,
        encrypted: secretData.encrypted,
      });
      dispatch(setUnencryptedPassphraseAuth(newBindedData));
      await onExistingAccount();
    }
    setIsDialogButtonLoading(false);
  };

  const handleDialogDismiss = () => {
    setIsLoadingGoogle(false);
    setShowInputGoogleDialog(false);
    setIsDialogButtonLoading(false);
    setSecretData({
      device: '',
      encrypted: '',
    });
    dispatch(
      showSnackbar({
        mode: 'error',
        text: t('google:signInCancelled'),
      }),
    );
  };

  return (
    <View>
      <AppTertiaryButton
        onPress={handleOnPress}
        loading={isLoadingGoogle}
        icon={iconMap.google}
        style={styles.googleSignInButton}>
        {t('auth:socialLogin')}
      </AppTertiaryButton>
      <AppDialogForm
        visible={showInputGoogleDialog}
        icon={iconMap.passphrase}
        title={t('auth:inputBinderPassword')}
        description={t('auth:inputBinderPasswordBody')}
        onDismiss={handleDialogDismiss}>
        <Formik
          initialValues={{
            password: '',
          }}
          onSubmit={async values => {
            setIsDialogButtonLoading(true);
            await handleDialogFormSubmit(values);
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
            <View>
              <Dialog.Content style={styles.dialogContent}>
                <AppFormSecureTextInput
                  label={t('auth:yourBinderPassword')}
                  style={{
                    height: hp(
                      touched.password && !!errors.password ? '15%' : '7.25%',
                      insets,
                    ),
                  }}
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
                  onSubmitEditing={isValid && dirty ? handleSubmit : () => {}}
                  blurOnSubmit={true}
                  returnKeyType="go"
                />
              </Dialog.Content>
              <Dialog.Actions style={styles.dialogAction}>
                <AppPrimaryButton
                  onPress={handleSubmit}
                  loading={isDialogButtonLoading}
                  disabled={!(isValid && dirty)}
                  style={styles.dialogButton}>
                  {t('auth:loginButton')}
                </AppPrimaryButton>
              </Dialog.Actions>
            </View>
          )}
        </Formik>
      </AppDialogForm>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    googleSignInButton: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    dialogAction: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: wp('7%', insets),
    },
    dialogButton: {
      width: '100%',
      marginBottom: hp('2%', insets),
    },
    dialogContent: {
      width: '100%',
      alignSelf: 'center',
      textAlign: 'center',
    },
  });
