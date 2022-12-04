import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import i18n from 'enevti-app/translations/i18n';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { navigateToTrimmer } from 'react-native-k4l-video-trimmer';
import { Video } from 'react-native-compressor';
import { store } from 'enevti-app/store/state';
import {
  hideModalLoader,
  setModalLoaderMode,
  setModalLoaderProgress,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';

interface OpenVideoEditorProps {
  navigation: StackNavigationProp<RootStackParamList>;
  source: string;
  duration: number;
  onSuccess?: (data: string) => void;
  onFailed?: (err: any) => void;
}

export function openVideoEditor({ navigation, source, duration, onSuccess, onFailed }: OpenVideoEditorProps) {
  if (Platform.OS === 'android') {
    const timeDuration = Math.floor(duration / 1000);
    navigateToTrimmer(
      source,
      timeDuration.toString(),
      i18n.t('editor:videoEditorMaxDuration', { duration: timeDuration }),
    )
      .then(res => {
        if (res !== null) {
          store.dispatch(setModalLoaderMode('progress'));
          store.dispatch(showModalLoader());
          Video.compress(`file://${res}`, { compressionMethod: 'auto' }, progress => {
            store.dispatch(setModalLoaderProgress(progress));
          }).then(compressed => {
            store.dispatch(hideModalLoader());
            onSuccess && onSuccess(compressed);
          });
        }
      })
      .catch(err => onFailed && onFailed(err));
  }
  if (Platform.OS === 'ios') {
    const successEventId = onSuccess ? EventRegister.addEventListener('onVideoEditorSuccess', onSuccess) : false;
    const failedEventId = onFailed ? EventRegister.addEventListener('onVideoEditorFailed', onFailed) : false;
    const successEvent = typeof successEventId === 'string' ? successEventId : undefined;
    const failedEvent = typeof failedEventId === 'string' ? failedEventId : undefined;
    navigation.navigate('VideoEditor', { successEvent, failedEvent, source, duration });
  }
}
