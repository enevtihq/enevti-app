import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppTertiaryButton from '../atoms/button/AppTertiaryButton';
import { iconMap } from '../atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSecretAppData, SecretAppData } from '../../service/google/appData';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/state';
import {
  getGoogleAccessToken,
  googleInit,
  googleSignIn,
} from '../../service/google/signIn';
import { setGoogleAPIToken } from '../../store/slices/session/google';
import { isInternetReachable } from '../../utils/network';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { showSnackbar } from '../../store/slices/ui/global';

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
  const apiToken = useSelector(
    (state: RootState) => state.session.google.apiToken,
  );
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);

  React.useEffect(() => {
    googleInit();
  }, []);

  const selectGoogleErrorText = (code: number) => {
    return code === -2
      ? t('network:noInternet')
      : code === -1
      ? t('google:unknownError')
      : code === statusCodes.SIGN_IN_CANCELLED
      ? t('google:signInCancelled')
      : code === statusCodes.IN_PROGRESS
      ? t('google:signInAlreadyInProgress')
      : code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ? t('google:signInUnavailableService')
      : '';
  };

  const handleOnPress = async () => {
    const isConnected = await isInternetReachable();
    if (!isConnected) {
      dispatch(
        showSnackbar({ mode: 'error', text: selectGoogleErrorText(-2) }),
      );

      return;
    }
    setIsLoadingGoogle(true);

    if (!apiToken) {
      const signInCode = await googleSignIn();
      if (signInCode !== 0) {
        dispatch(
          showSnackbar({
            mode: 'error',
            text: selectGoogleErrorText(signInCode),
          }),
        );
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
  });
