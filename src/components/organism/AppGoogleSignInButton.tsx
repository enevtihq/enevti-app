import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppTertiaryButton from '../atoms/button/AppTertiaryButton';
import { iconMap } from '../atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSecretAppData, SecretAppData } from '../../service/google/appData';
import { useDispatch } from 'react-redux';
import { store } from '../../store/state';
import {
  getGoogleAccessToken,
  googleInit,
  googleSignIn,
} from '../../service/google/signIn';
import {
  setGoogleAPIToken,
  getGoogleAPITokenState,
} from '../../store/slices/session/google';
import { isInternetReachable } from '../../utils/network';
import AppSnackBar from '../atoms/snackbar/AppSnackbar';
import { statusCodes } from '@react-native-google-signin/google-signin';

interface AppGoogleSignInButtonProps {
  onSuccess: (data: SecretAppData) => void;
}

export default function AppGoogleSignInButton({
  onSuccess,
}: AppGoogleSignInButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);
  const apiToken = getGoogleAPITokenState(store.getState());
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorCode, setErrorCode] = React.useState<number>(0);

  React.useEffect(() => {
    googleInit();
  }, []);

  const handleOnPress = async () => {
    const isConnected = await isInternetReachable();
    if (!isConnected) {
      setShowError(true);
      setErrorCode(-2);
      return;
    }
    setIsLoadingGoogle(true);

    if (!apiToken) {
      const signInCode = await googleSignIn();
      if (signInCode !== 0) {
        setShowError(true);
        setErrorCode(signInCode);
        setIsLoadingGoogle(false);
        return;
      }

      const newApiToken = await getGoogleAccessToken();
      dispatch(setGoogleAPIToken(newApiToken));
    }

    const data = await getSecretAppData();
    await onSuccess(data);
    setIsLoadingGoogle(false);
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
      <AppSnackBar
        mode={'error'}
        visible={showError}
        style={styles.errorSnack}
        onDismiss={() => setShowError(false)}
        duration={1500}>
        {errorCode === -2
          ? t('network:noInternet')
          : errorCode === -1
          ? t('google:unknownError')
          : errorCode === statusCodes.SIGN_IN_CANCELLED
          ? t('google:signInCancelled')
          : errorCode === statusCodes.IN_PROGRESS
          ? t('google:signInAlreadyInProgress')
          : errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          ? t('google:signInUnavailableService')
          : ''}
      </AppSnackBar>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    errorSnack: {
      alignSelf: 'center',
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    googleSignInButton: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
