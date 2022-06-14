import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { EventRegister } from 'react-native-event-listeners';

export function openQRScanner(
  navigation: StackNavigationProp<RootStackParamList>,
  onSuccess: (data: string) => void,
  onFailed?: () => void,
) {
  const successEvent = EventRegister.addEventListener('onQRScannerSuccess', onSuccess);
  const failedEventId = onFailed ? EventRegister.addEventListener('onQRScannerFailed', onFailed) : false;
  if (typeof successEvent === 'string') {
    const failedEvent = typeof failedEventId === 'string' ? failedEventId : undefined;
    navigation.navigate('QRScanner', { successEvent, failedEvent });
  }
}
