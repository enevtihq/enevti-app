import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { navigateToTrimmer } from 'react-native-k4l-video-trimmer';
import RNVideoHelper from 'react-native-video-helper';

interface OpenVideoEditorProps {
  navigation: StackNavigationProp<RootStackParamList>;
  source: string;
  duration: number;
  onSuccess?: (data: string) => void;
  onFailed?: (err: any) => void;
}

export function openVideoEditor({ navigation, source, duration, onSuccess, onFailed }: OpenVideoEditorProps) {
  if (Platform.OS === 'android') {
    // TODO: localize trimmer title
    const timeDuration = Math.floor(duration / 1000);
    navigateToTrimmer(source, timeDuration.toString(), `Select Max ${timeDuration}s`).then(res => {
      if (res !== null) {
        RNVideoHelper.compress(res, {
          quality: 'low',
        }).then(compressed => {
          onSuccess && onSuccess(compressed);
        });
      }
    });
  }
  if (Platform.OS === 'ios') {
    const successEventId = onSuccess ? EventRegister.addEventListener('onVideoEditorSuccess', onSuccess) : false;
    const failedEventId = onFailed ? EventRegister.addEventListener('onVideoEditorFailed', onFailed) : false;
    const successEvent = typeof successEventId === 'string' ? successEventId : undefined;
    const failedEvent = typeof failedEventId === 'string' ? failedEventId : undefined;
    navigation.navigate('VideoEditor', { successEvent, failedEvent, source, duration });
  }
}
