import { View, StyleSheet, Keyboard } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import {
  getGoogleAccessToken,
  googleInit,
  googleSignIn,
} from 'enevti-app/service/google/signIn';
import {
  selectGoogleAPITokenState,
  setGoogleAPIToken,
} from 'enevti-app/store/slices/session/google';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import AppMenuFormSecureTextInput from 'enevti-app/components/organism/menu/AppMenuFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import {
  getSecretAppData,
  isExistingAccount,
  SecretAppData,
  updateSecretAppData,
} from 'enevti-app/service/google/appData';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppTertiaryButton from 'enevti-app/components/atoms/button/AppTertiaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  decryptWithDevice,
  decryptWithPassword,
  encryptWithDevice,
} from 'enevti-app/utils/cryptography';
import { handleError } from 'enevti-app/utils/error/handle';
import { initPassphraseWithDevice } from 'enevti-app/store/middleware/thunk/session/initPassphraseWithDevice';
import { isValidPassphrase } from 'enevti-app/utils/passphrase';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';

YupPassword(Yup);

const initialSecretData: SecretAppData = {
  device: {
    status: '',
    data: '',
    version: 0,
  },
  encrypted: {
    status: '',
    data: '',
    version: 0,
  },
};

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
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const apiToken = useSelector(selectGoogleAPITokenState);

  const snapPoints = React.useMemo(() => ['62%'], []);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);
  const [showInputGoogleDialog, setShowInputGoogleDialog] =
    React.useState<boolean>(false);
  const [isDialogButtonLoading, setIsDialogButtonLoading] =
    React.useState<boolean>(false);
  const [secretData, setSecretData] =
    React.useState<SecretAppData>(initialSecretData);

  React.useEffect(() => {
    googleInit();
  }, []);

  const handleOnPress = async () => {
    setIsLoadingGoogle(true);

    try {
      if (!apiToken) {
        await googleSignIn();
        const newApiToken = await getGoogleAccessToken();
        dispatch(setGoogleAPIToken(newApiToken));
      }

      const data = await getSecretAppData();
      setSecretData(data);

      if (isExistingAccount(data)) {
        const decrypted = await decryptWithDevice(
          data.device.data,
          data.device.version,
        );
        if (
          decrypted.status === 'error' ||
          !isValidPassphrase(decrypted.data)
        ) {
          setShowInputGoogleDialog(true);
          return;
        } else {
          dispatch(initPassphraseWithDevice(data.device, decrypted.data));
          onExistingAccount();
        }
      } else {
        onNewAccount();
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleDialogFormSubmit = async (values: any) => {
    try {
      const decrypted = await decryptWithPassword(
        secretData.encrypted.data,
        values.password,
        secretData.encrypted.version,
      );
      if (decrypted.status === 'error' || !isValidPassphrase(decrypted.data)) {
        dispatch(
          showSnackbar({
            mode: 'error',
            text: t('auth:wrongPassword'),
          }),
        );
        return;
      } else {
        const newBindedData = await encryptWithDevice(decrypted.data);
        await updateSecretAppData({
          device: newBindedData,
          encrypted: secretData.encrypted,
        });
        dispatch(initPassphraseWithDevice(newBindedData, decrypted.data));
        setShowInputGoogleDialog(false);
        onExistingAccount();
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsDialogButtonLoading(false);
    }
  };

  const handleDialogDismiss = () => {
    setIsLoadingGoogle(false);
    setShowInputGoogleDialog(false);
    setIsDialogButtonLoading(false);
    setSecretData(initialSecretData);
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
      <AppMenuContainer
        backDisabled
        visible={showInputGoogleDialog}
        snapPoints={snapPoints}
        onDismiss={handleDialogDismiss}>
        <Formik
          initialValues={{
            password: '',
          }}
          onSubmit={async values => {
            Keyboard.dismiss();
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
            <View style={styles.modalBox}>
              <AppHeaderWizard
                noHeaderSpace
                mode={'icon'}
                modeData={'passphrase'}
                style={styles.modalHeader}
                title={t('auth:inputBinderPassword')}
                description={t('auth:inputBinderPasswordBody')}
              />
              <View style={styles.dialogContent}>
                <AppMenuFormSecureTextInput
                  label={t('auth:yourBinderPassword')}
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
                  returnKeyType={'done'}
                />
              </View>
              <View style={styles.dialogAction}>
                <AppPrimaryButton
                  onPress={handleSubmit}
                  loading={isDialogButtonLoading}
                  disabled={!(isValid && dirty)}
                  style={styles.dialogButton}>
                  {t('auth:loginButton')}
                </AppPrimaryButton>
              </View>
            </View>
          )}
        </Formik>
      </AppMenuContainer>
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    modalBox: {
      height: '100%',
      paddingBottom: insets.bottom,
    },
    googleSignInButton: {
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    dialogAction: {
      width: '100%',
      paddingHorizontal: wp('5%', insets),
    },
    dialogButton: {
      width: '100%',
      marginBottom: hp('3%', insets),
    },
    dialogContent: {
      width: '100%',
      paddingLeft: wp('5%', insets),
      paddingRight: wp('5%', insets),
      marginBottom: hp('2%', insets),
      flex: 1,
    },
    modalHeader: {
      width: wp('85%', insets),
      marginTop: hp('2%', insets),
      marginBottom: hp('3%', insets),
      alignSelf: 'center',
      flex: 0,
    },
  });
