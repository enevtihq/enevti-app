import { StyleSheet, View } from 'react-native';
import React from 'react';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { EventRegister } from 'react-native-event-listeners';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppView from 'enevti-app/components/atoms/view/AppView';
import {
  resetStatusBarState,
  setStatusBarBackground,
  setStatusBarTint,
} from 'enevti-app/store/slices/ui/global/statusbar';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

type Props = StackScreenProps<RootStackParamList, 'QRScanner'>;

export function openQRScanner(navigation: StackNavigationProp<RootStackParamList>, onSuccess: (data: string) => void) {
  const eventId = EventRegister.addEventListener('onQRScannerSuccess', onSuccess);
  if (typeof eventId === 'string') {
    navigation.navigate('QRScanner', { eventId });
  }
}

export default function QRScanner({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);
  const [visible, setVisible] = React.useState<boolean>(false);
  const barcodeScannedRef = React.useRef<boolean>(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      dispatch(resetStatusBarState());
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      dispatch(setStatusBarBackground('transparent'));
      dispatch(setStatusBarTint('light'));
    });

    async function init() {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === 'denied') {
        dispatch(showSnackbar({ mode: 'error', text: t('error:deniedCamera') }));
        navigation.goBack();
      }
      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission === 'denied') {
          dispatch(showSnackbar({ mode: 'error', text: t('error:deniedCameraDecided') }));
          navigation.goBack();
        }
      }
    }
    init();

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
      EventRegister.removeEventListener(route.params.eventId);
    };
  }, [navigation, dispatch, route.params.eventId, t]);

  React.useEffect(() => {
    setTimeout(() => setVisible(true), 500);
  }, []);

  const onSuccess = React.useCallback(
    (data: string) => {
      navigation.goBack();
      EventRegister.emit('onQRScannerSuccess', data);
    },
    [navigation],
  );

  React.useEffect(() => {
    if (barcodes.length > 0 && !barcodeScannedRef.current) {
      barcodeScannedRef.current = true;
      onSuccess(barcodes[0].content.data.toString());
    }
  }, [barcodes, onSuccess]);

  return device && visible ? (
    <AppView edges={['bottom', 'left', 'right']}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </AppView>
  ) : (
    <AppView edges={['bottom', 'left', 'right']}>
      <View style={styles.loaderContainer}>
        <AppActivityIndicator animating={true} />
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
  });
