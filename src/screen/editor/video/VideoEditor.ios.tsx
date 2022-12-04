import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ProcessingManager, Trimmer, VideoPlayer } from 'react-native-video-processing';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import sleep from 'enevti-app/utils/dummy/sleep';
import { useDebouncedCallback } from 'use-debounce';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import {
  hideModalLoader,
  setModalLoaderMode,
  setModalLoaderProgress,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { cleanTMPImage } from 'enevti-app/service/enevti/nft';
import RNVideoHelper from 'react-native-video-helper';
import { useTranslation } from 'react-i18next';
import { Video } from 'react-native-compressor';

const TRIMMER_HEIGHT_PERCENTAGE = 8;
const TRIMMER_WIDTH_PERCENTAGE = 80;

type Props = StackScreenProps<RootStackParamList, 'VideoEditor'>;

export default function VideoEditor({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const [play, setPlay] = React.useState<boolean>(true);
  const [portrait, setPortrait] = React.useState<boolean>(false);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [videoMounted, setVideoMounted] = React.useState<boolean>(false);

  const [playerStartTime, setPlayerStartTime] = React.useState<number>(0);
  const [playerEndTime, setPlayerEndTime] = React.useState<number>(0);
  const [trimmerStartTime, setTrimmerStartTime] = React.useState<number>(0);
  const [trimmerEndTime, setTrimmerEndTime] = React.useState<number>(0);
  const trimmedDuration = React.useMemo(() => trimmerEndTime - trimmerStartTime, [trimmerEndTime, trimmerStartTime]);
  const canContinue = React.useMemo(
    () => trimmedDuration <= route.params.duration,
    [route.params.duration, trimmedDuration],
  );

  const initPlayerTime = React.useCallback(async () => {
    const result = await ProcessingManager.getVideoInfo(route.params.source);
    if (result.size.height > result.size.width) {
      setPortrait(true);
    }
    setPlayerEndTime(result.duration);
    setTrimmerEndTime(result.duration);
    setVideoMounted(true);
  }, [route.params.source]);

  const clearTempFile = React.useCallback(() => {
    cleanTMPImage();
  }, []);

  React.useEffect(() => {
    initPlayerTime();
    return () => {
      clearTempFile();
    };
  }, [initPlayerTime, clearTempFile]);

  const remountVideo = React.useCallback(async () => {
    setVideoMounted(false);
    await sleep(1);
    setVideoMounted(true);
  }, []);

  const debouncedTrimOnChange = useDebouncedCallback(
    async (e: { startTime: number; endTime: number }) => {
      setTrimmerStartTime(e.startTime);
      setTrimmerEndTime(e.endTime);

      setPlayerStartTime(e.startTime);
      setPlayerEndTime(e.endTime);
      await remountVideo();
    },
    100,
    { leading: false, trailing: true },
  );

  const trimOnChange = React.useCallback(
    async (e: { startTime: number; endTime: number }) => {
      debouncedTrimOnChange(e);
    },
    [debouncedTrimOnChange],
  );

  const clearEventRegister = React.useCallback(() => {
    route.params.successEvent && EventRegister.removeEventListener(route.params.successEvent);
    route.params.failedEvent && EventRegister.removeEventListener(route.params.failedEvent);
  }, [route.params.failedEvent, route.params.successEvent]);

  const onCancel = React.useCallback(() => {
    navigation.goBack();
    clearEventRegister();
  }, [clearEventRegister, navigation]);

  const trimVideo = React.useCallback(
    async (startTime: number, endTime: number) => {
      const result = await RNVideoHelper.compress(route.params.source, {
        startTime,
        endTime,
        quality: 'high',
      });
      const compressed = await Video.compress(result, { compressionMethod: 'auto' }, progress => {
        dispatch(setModalLoaderProgress(progress));
      });
      return compressed;
    },
    [dispatch, route.params.source],
  );

  const onContinue = React.useCallback(async () => {
    try {
      dispatch(setModalLoaderMode('progress'));
      dispatch(showModalLoader());
      const result = await trimVideo(trimmerStartTime, trimmerEndTime);
      EventRegister.emit('onVideoEditorSuccess', result);
    } catch (err: any) {
      EventRegister.emit('onVideoEditorFailed', Error(err));
    } finally {
      dispatch(hideModalLoader());
      navigation.goBack();
      clearEventRegister();
    }
  }, [clearEventRegister, dispatch, navigation, trimVideo, trimmerEndTime, trimmerStartTime]);

  return (
    <AppView withModal contentContainerStyle={styles.container}>
      <View style={styles.videoContainer}>
        {videoMounted ? (
          <VideoPlayer
            volume={muted ? 0 : 1}
            startTime={playerStartTime}
            endTime={playerEndTime}
            play={play}
            replay={true}
            rotate={portrait}
            source={route.params.source}
            playerWidth={wp(100)}
            playerHeight={hp(70)}
            style={styles.video}
            resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
          />
        ) : null}
      </View>
      <View style={styles.trimmer}>
        <Trimmer
          source={route.params.source}
          height={hp(TRIMMER_HEIGHT_PERCENTAGE) * 0.7}
          width={wp(TRIMMER_WIDTH_PERCENTAGE)}
          themeColor={'white'}
          thumbWidth={20}
          trackerColor={'transparent'}
          onChange={trimOnChange}
        />
      </View>
      <View style={styles.space} />
      <View style={styles.durationContainer}>
        <AppTextBody5 style={styles.startDuration}>{trimmerStartTime.toFixed(2)}</AppTextBody5>
        <AppTextBody4 style={styles.trimmedDuration}>{`${trimmedDuration.toFixed(2)}s`}</AppTextBody4>
        <AppTextBody5 style={styles.endDuration}>{trimmerEndTime.toFixed(2)}</AppTextBody5>
      </View>
      <View style={styles.space} />
      <View style={styles.actionContainer}>
        <View style={styles.actionItem}>
          <AppQuaternaryButton onPress={onCancel} contentStyle={styles.cancelContent}>
            <AppTextBody3 style={styles.actionText}>{t('editor:cancel')}</AppTextBody3>
          </AppQuaternaryButton>
        </View>
        <View style={styles.actionItem}>
          <View style={styles.middleActions}>
            <AppQuaternaryButton onPress={() => setMuted(old => !old)} contentStyle={styles.middleActionsItem}>
              <AppIconComponent name={muted ? iconMap.volumeOff : iconMap.volumeOn} size={hp(3)} color={'white'} />
            </AppQuaternaryButton>
            <AppQuaternaryButton onPress={() => setPlay(old => !old)} contentStyle={styles.middleActionsItem}>
              <AppIconComponent name={play ? iconMap.play : iconMap.pause} size={hp(3)} color={'white'} />
            </AppQuaternaryButton>
          </View>
        </View>
        <View style={styles.actionItem}>
          <AppQuaternaryButton disabled={!canContinue} onPress={onContinue} contentStyle={styles.continueStyle}>
            <AppTextBody3 style={styles.actionText}>
              {canContinue
                ? t('editor:continue')
                : t('editor:pickMax', { duration: Math.floor(route.params.duration / 1000) })}
            </AppTextBody3>
          </AppQuaternaryButton>
        </View>
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    videoContainer: {
      flex: 1,
    },
    video: {
      backgroundColor: 'black',
      justifyContent: 'center',
    },
    trimmer: {
      height: hp(TRIMMER_HEIGHT_PERCENTAGE),
      width: wp(TRIMMER_WIDTH_PERCENTAGE),
      alignSelf: 'center',
    },
    space: {
      height: hp(0.75),
    },
    durationContainer: {
      flexDirection: 'row',
      marginHorizontal: wp(5),
    },
    startDuration: {
      color: theme.colors.placeholder,
      flex: 1,
      textAlign: 'left',
      alignSelf: 'center',
    },
    trimmedDuration: {
      flex: 1,
      textAlign: 'center',
    },
    endDuration: {
      color: theme.colors.placeholder,
      flex: 1,
      textAlign: 'right',
      alignSelf: 'center',
    },
    actionContainer: {
      height: hp(8),
      marginHorizontal: wp(5),
      flexDirection: 'row',
    },
    actionItem: {
      flex: 1,
    },
    cancelContent: {
      width: '100%',
      alignItems: 'center',
    },
    actionText: {
      color: 'white',
    },
    middleActions: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    middleActionsItem: {
      alignItems: 'center',
      marginHorizontal: wp(1),
    },
    continueStyle: {
      width: '100%',
      alignItems: 'center',
    },
  });
