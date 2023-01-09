import { View, StyleSheet, Keyboard } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';

import { googleInit, googleSignOut } from 'enevti-app/service/google/signIn';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import AppMenuFormSecureTextInput from 'enevti-app/components/organism/menu/AppMenuFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import {
  getSecretAppData,
  isExistingAccount,
  SecretAppData,
  updateSecretAppData,
} from 'enevti-app/service/google/appData';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppTertiaryButton from 'enevti-app/components/atoms/button/AppTertiaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  decryptWithDevice,
  decryptWithPassword,
  encryptWithDevice,
  encryptWithPassword,
  getPbkdf2Iteration,
} from 'enevti-app/utils/cryptography';
import { handleError } from 'enevti-app/utils/error/handle';
import { initPassphraseWithDevice } from 'enevti-app/store/middleware/thunk/session/initPassphraseWithDevice';
import { isValidPassphrase } from 'enevti-app/utils/passphrase';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import AppAlertModal from '../menu/AppAlertModal';
import base64 from 'react-native-base64';
import { EncryptedBase } from 'enevti-app/types/core/service/cryptography';

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

export default function AppGoogleSignInButton({ onNewAccount, onExistingAccount }: AppGoogleSignInButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const snapPoints = React.useMemo(() => ['62%'], []);
  const secretDataRef = React.useRef<SecretAppData>(initialSecretData);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);
  const [showInputGoogleDialog, setShowInputGoogleDialog] = React.useState<boolean>(false);
  const [isDialogButtonLoading, setIsDialogButtonLoading] = React.useState<boolean>(false);
  const [alertShow, setAlertShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    googleInit();
  }, []);

  const handleOnPress = async () => {
    setIsLoadingGoogle(true);

    try {
      const data = await getSecretAppData();
      secretDataRef.current = data;

      if (isExistingAccount(data)) {
        const decrypted = await decryptWithDevice(data.device.data, data.device.version);
        if (decrypted.status === 'error' || !isValidPassphrase(decrypted.data)) {
          setShowInputGoogleDialog(true);
          return;
        } else {
          const currentIteration = (JSON.parse(base64.decode(data.device.data)) as EncryptedBase).iterations;
          if (currentIteration !== (await getPbkdf2Iteration())) {
            Object.assign(data.device, await encryptWithDevice(decrypted.data));
            await updateSecretAppData({
              device: data.device,
              encrypted: secretDataRef.current.encrypted,
            });
          }
          dispatch(initPassphraseWithDevice(data.device, decrypted.data));
          onExistingAccount();
        }
      } else {
        onNewAccount();
      }
    } catch (err: any) {
      await googleSignOut();
      handleError(err);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleDialogFormSubmit = async (values: any) => {
    try {
      const decrypted = await decryptWithPassword(
        secretDataRef.current.encrypted.data,
        values.password,
        secretDataRef.current.encrypted.version,
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
        const currentIteration = (JSON.parse(base64.decode(secretDataRef.current.encrypted.data)) as EncryptedBase)
          .iterations;
        if (currentIteration !== (await getPbkdf2Iteration())) {
          secretDataRef.current = {
            ...secretDataRef.current,
            encrypted: await encryptWithPassword(decrypted.data, values.password),
          };
        }
        await updateSecretAppData({
          device: newBindedData,
          encrypted: secretDataRef.current.encrypted,
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
    secretDataRef.current = initialSecretData;
  };

  return (
    <View>
      <AppTertiaryButton
        onPress={() => setAlertShow(old => !old)}
        loading={isLoadingGoogle}
        icon={iconMap.google}
        style={styles.googleSignInButton}>
        {t('auth:socialLogin')}
      </AppTertiaryButton>
      <AppAlertModal
        visible={alertShow}
        height={55}
        onDismiss={() => setAlertShow(false)}
        iconName={'announcement'}
        title={'Heads Up!'}
        description={
          'To try google login (testing mode), you must inform your gmail account to Enevti.com team, otherwise login will failed'
        }
        secondaryButtonText={'Got it!'}
        secondaryButtonIsLoading={isLoadingGoogle}
        secondaryButtonOnPress={handleOnPress}
      />
      <AppMenuContainer
        backDisabled
        dismissKeyboard
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
          {({ handleChange, submitForm, setFieldTouched, values, errors, isValid, dirty, touched }) => (
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
                    errors.password ? (values.password.length > 0 ? t('form:password') : t('form:required')) : ''
                  }
                  showError={touched.password}
                  touchHandler={() => setFieldTouched('password')}
                  onChangeText={handleChange('password')}
                  onSubmitEditing={isValid && dirty ? submitForm : () => {}}
                  blurOnSubmit={true}
                  returnKeyType={'done'}
                />
              </View>
              <View style={styles.dialogAction}>
                <AppPrimaryButton
                  onPress={submitForm}
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
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    dialogAction: {
      width: '100%',
      paddingHorizontal: wp('5%'),
    },
    dialogButton: {
      width: '100%',
      marginBottom: hp('3%'),
    },
    dialogContent: {
      width: '100%',
      paddingLeft: wp('5%'),
      paddingRight: wp('5%'),
      marginBottom: hp('2%'),
      flex: 1,
    },
    modalHeader: {
      width: wp('85%'),
      marginTop: hp('2%'),
      marginBottom: hp('3%'),
      alignSelf: 'center',
      flex: 0,
    },
  });
