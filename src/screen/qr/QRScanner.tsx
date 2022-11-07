import { StyleSheet, Vibration, View } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { EventRegister } from 'react-native-event-listeners';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { resetStatusBarState, setStatusBarState } from 'enevti-app/store/slices/ui/global/statusbar';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

type Props = StackScreenProps<RootStackParamList, 'QRScanner'>;

export default function QRScanner({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(200), []);
  const [visible, setVisible] = React.useState<boolean>(false);
  const barcodeScannedRef = React.useRef<boolean>(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      route.params.blurEvent && EventRegister.emit('onQRScannerBlur');
      if (!barcodeScannedRef.current) {
        route.params.failedEvent && EventRegister.emit('onQRScannerFailed');
      }

      route.params.focusEvent && EventRegister.removeEventListener(route.params.focusEvent);
      route.params.blurEvent && EventRegister.removeEventListener(route.params.blurEvent);
      route.params.failedEvent && EventRegister.removeEventListener(route.params.failedEvent);

      route.params.fullscreen && dispatch(resetStatusBarState());
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      route.params.focusEvent && EventRegister.emit('onQRScannerFocus');
      if (route.params.fullscreen) {
        dispatch(setStatusBarState({ background: 'transparent', tint: 'light' }));
      }
    });

    async function init() {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'denied') {
        dispatch(showSnackbar({ mode: 'error', text: t('error:deniedCameraDecided') }));
        navigation.goBack();
      } else {
        const initTimeout = setTimeout(() => {
          setVisible(true);
          clearTimeout(initTimeout);
        }, 500);
      }
    }
    init();

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
      EventRegister.removeEventListener(route.params.successEvent);
    };
  }, [
    navigation,
    dispatch,
    route.params.successEvent,
    route.params.failedEvent,
    route.params.focusEvent,
    route.params.blurEvent,
    route.params.fullscreen,
    t,
  ]);

  const onSuccess = React.useCallback(
    (data: string) => {
      Vibration.vibrate();
      EventRegister.emit('onQRScannerSuccess', data);
      navigation.goBack();
    },
    [navigation],
  );

  React.useEffect(() => {
    if (barcodes.length > 0 && !barcodeScannedRef.current) {
      barcodeScannedRef.current = true;
      onSuccess(barcodes[0].displayValue ?? barcodes[0].content.data.toString());
    }
  }, [barcodes, onSuccess]);

  return device && visible ? (
    <AppView
      edges={['bottom', 'left', 'right']}
      headerOffset={0}
      header={
        <AppHeader
          back
          title={' '}
          backIcon={iconMap.close}
          iconStyle={styles.headerIcon}
          backgroundStyle={styles.headerBackground}
          navigation={navigation}
        />
      }>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <View style={styles.boxTopLeft} />
          <View style={styles.boxTopRight} />
          <View style={styles.boxBottomLeft} />
          <View style={styles.boxBottomRight} />
        </View>
      </View>
    </AppView>
  ) : (
    <AppView edges={['bottom', 'left', 'right']}>
      <View style={styles.loaderContainer}>
        <AppActivityIndicator animating={true} />
      </View>
    </AppView>
  );
}

const makeStyles = (boxWidth: number) =>
  StyleSheet.create({
    headerIcon: {
      color: 'white',
    },
    headerBackground: {
      backgroundColor: 'transparent',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    boxContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    box: {
      width: boxWidth,
      height: boxWidth,
    },
    boxTopLeft: {
      position: 'absolute',
      width: boxWidth / 4,
      height: boxWidth / 4,
      borderWidth: 2,
      borderColor: 'white',
      borderBottomWidth: 0,
      borderRightWidth: 0,
      top: 0,
      left: 0,
    },
    boxTopRight: {
      position: 'absolute',
      width: boxWidth / 4,
      height: boxWidth / 4,
      borderWidth: 2,
      borderColor: 'white',
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      top: 0,
      right: 0,
    },
    boxBottomLeft: {
      position: 'absolute',
      width: boxWidth / 4,
      height: boxWidth / 4,
      borderWidth: 2,
      borderColor: 'white',
      borderTopWidth: 0,
      borderRightWidth: 0,
      bottom: 0,
      left: 0,
    },
    boxBottomRight: {
      position: 'absolute',
      width: boxWidth / 4,
      height: boxWidth / 4,
      borderWidth: 2,
      borderColor: 'white',
      borderTopWidth: 0,
      borderLeftWidth: 0,
      bottom: 0,
      right: 0,
    },
  });
