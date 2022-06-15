import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { EventRegister } from 'react-native-event-listeners';

interface OpenQRScannerProps {
  navigation: StackNavigationProp<RootStackParamList>;
  onSuccess: (data: string) => void;
  onFailed?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  fullscreen?: boolean;
}

export function openQRScanner({ navigation, onSuccess, onFailed, onFocus, onBlur, fullscreen }: OpenQRScannerProps) {
  const successEvent = EventRegister.addEventListener('onQRScannerSuccess', onSuccess);
  const failedEventId = onFailed ? EventRegister.addEventListener('onQRScannerFailed', onFailed) : false;
  const focusEventId = onFocus ? EventRegister.addEventListener('onQRScannerFocus', onFocus) : false;
  const blurEventId = onBlur ? EventRegister.addEventListener('onQRScannerBlur', onBlur) : false;
  if (typeof successEvent === 'string') {
    const failedEvent = typeof failedEventId === 'string' ? failedEventId : undefined;
    const focusEvent = typeof focusEventId === 'string' ? focusEventId : undefined;
    const blurEvent = typeof blurEventId === 'string' ? blurEventId : undefined;
    navigation.navigate('QRScanner', { successEvent, failedEvent, focusEvent, blurEvent, fullscreen });
  }
}
