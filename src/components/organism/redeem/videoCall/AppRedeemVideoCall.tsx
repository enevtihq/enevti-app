import { View, Platform, PermissionsAndroid, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Socket } from 'socket.io-client';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { RoomErrorEventCb, RoomEventCb, TrackEventCb, TwilioVideo } from 'react-native-twilio-video-webrtc';
import { getMyAddress, getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';
import { answerVideoCall, startVideoCall } from 'enevti-app/utils/network';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusBarBackground, setStatusBarTint } from 'enevti-app/store/slices/ui/global/statusbar';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import darkTheme from 'enevti-app/theme/dark';
import AppVideoCallLocalView from './AppVideoCallLocalView';
import sleep from 'enevti-app/utils/dummy/sleep';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import {
  CallAnsweredParam,
  CallEndedParam,
  CallErrorParam,
  CallRejectedParam,
  CallStartedParam,
  CallStatus,
} from 'enevti-app/types/core/service/call';
import { handleError } from 'enevti-app/utils/error/handle';
import defaultTheme from 'enevti-app/theme/default';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppVideoCallParticipantView from './AppVideoCallParticipantView';
import { Persona } from 'enevti-app/types/core/account/persona';
import { getNFTbyId } from 'enevti-app/service/enevti/nft';
import AppVideoCallHeader from './AppVideoCallHeader';
import {
  callAnswerSound,
  callEndSound,
  callingSound,
  cleanCallSound,
  initCallSound,
} from 'enevti-app/service/call/device/sound';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';

interface AppRedeemVideoCallProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'RedeemVideoCall'>;
}

export default function AppRedeemVideoCall({ navigation, route }: AppRedeemVideoCallProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = React.useRef<Socket | undefined>();
  const styles = React.useMemo(() => makeStyles(), []);

  const myPersona = useSelector(selectMyPersonaCache);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isParticipantAudioEnabled, setIsParticipantAudioEnabled] = React.useState(true);
  const [isParticipantVideoEnabled, setIsParticipantVideoEnabled] = React.useState(true);
  const [isFrontCamera, setIsFrontCamera] = React.useState(true);
  const [status, setStatus] = React.useState<CallStatus>('authorizing');
  const [participantVideoSid, setParticipantVideoSid] = React.useState<string>('');
  const [participantVideoTrackSid, setParticipantVideoTrackSid] = React.useState<string>('');
  const [, setParticipantAudioSid] = React.useState<string>('');
  const [, setParticipantAudioTrackSid] = React.useState<string>('');
  const twilioRef = React.useRef<TwilioVideo>(null);
  const myPublicKey = React.useRef<string>('');
  const callId = React.useRef<string>('');
  const callReady = React.useRef<boolean>(false);
  const [participantPersona, setParticipantPersona] = React.useState<Persona | undefined>();

  const onCallStarting = React.useCallback(async (param: CallStartedParam) => {
    callReady.current && callingSound?.play();
    callId.current = param.callId;
    setLoaded(true);
    if (myPublicKey.current && myPublicKey.current === param.emitter) {
      twilioRef.current?.connect({ accessToken: param.twilioToken });
    }
    setStatus('starting');
  }, []);

  const onCallRinging = React.useCallback(async () => {
    setStatus('ringing');
  }, []);

  const onCallAnswered = React.useCallback(
    async (param: CallAnsweredParam) => {
      setLoaded(true);
      if (route.params.isAnswering && route.params.callId) {
        setTimeout(() => setMinimized(true), 2000);
      } else {
        callReady.current && callingSound?.stop();
        callReady.current && callAnswerSound?.play();
        setMinimized(true);
      }
      if (myPublicKey.current && myPublicKey.current === param.emitter) {
        twilioRef.current?.connect({ accessToken: param.twilioToken });
      }
      setStatus('answered');
    },
    [route.params.callId, route.params.isAnswering],
  );

  const onExitCall = React.useCallback(async () => {
    callReady.current && callingSound?.stop();
    callReady.current && callEndSound?.play();
    await sleep(1000);
    twilioRef.current?.disconnect();
    socket.current?.disconnect();
    navigation.goBack();
  }, [navigation]);

  const onCallRejected = React.useCallback(
    async (_param: CallRejectedParam) => {
      setStatus('rejected');
      await onExitCall();
    },
    [onExitCall],
  );

  const onCallEnded = React.useCallback(
    async (param: CallEndedParam) => {
      setStatus('ended');
      if (param.emitter !== myPublicKey.current) {
        await onExitCall();
      }
    },
    [onExitCall],
  );

  const onCallDisconnected = React.useCallback(async () => {
    await onExitCall();
  }, [onExitCall]);

  const onCallError = React.useCallback(
    async (_param: CallErrorParam) => {
      setStatus('error');
      dispatch(showSnackbar({ mode: 'error', text: t('error:clientError') }));
      await onExitCall();
    },
    [dispatch, onExitCall, t],
  );

  const onEndButtonPress = React.useCallback(async () => {
    if (status === 'answered') {
      socket.current?.emit('ended', { callId: callId.current, emitter: myPublicKey.current });
    } else {
      setStatus('exited');
    }
    await onExitCall();
  }, [onExitCall, status]);

  const onMuteButtonPress = () => {
    twilioRef.current?.setLocalAudioEnabled(!isAudioEnabled).then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const onVideoToggleButtonPress = () => {
    twilioRef.current?.setLocalVideoEnabled(!isVideoEnabled).then(isEnabled => setIsVideoEnabled(isEnabled));
  };

  const onFlipButtonPress = () => {
    setIsFrontCamera(old => !old);
    twilioRef.current?.flipCamera();
  };

  const onRoomDidConnect: RoomEventCb = React.useCallback(() => {}, []);

  const onRoomDidDisconnect: RoomErrorEventCb = React.useCallback(() => {}, []);

  const onRoomDidFailToConnect: RoomErrorEventCb = React.useCallback(
    async error => {
      try {
        handleError(error);
      } catch {}
      setStatus('error');
      await sleep(1000);
      onEndButtonPress();
    },
    [onEndButtonPress],
  );

  const onParticipantAddedVideoTrack: TrackEventCb = React.useCallback(({ participant, track }) => {
    setIsParticipantVideoEnabled(true);
    setParticipantVideoSid(participant.sid);
    setParticipantVideoTrackSid(track.trackSid);
  }, []);

  const onParticipantRemovedVideoTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantVideoEnabled(false);
    setParticipantVideoSid('');
    setParticipantVideoTrackSid('');
  }, []);

  const onParticipantAddedAudioTrack: TrackEventCb = React.useCallback(({ participant, track }) => {
    setIsParticipantAudioEnabled(true);
    setParticipantAudioSid(participant.sid);
    setParticipantAudioTrackSid(track.trackSid);
  }, []);

  const onParticipantRemovedAudioTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantAudioEnabled(false);
    setParticipantAudioSid('');
    setParticipantAudioTrackSid('');
  }, []);

  const onParticipantEnabledVideoTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantVideoEnabled(true);
  }, []);

  const onParticipantDisabledVideoTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantVideoEnabled(false);
  }, []);

  const onParticipantEnabledAudioTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantAudioEnabled(true);
  }, []);

  const onParticipantDisabledAudioTrack: TrackEventCb = React.useCallback(() => {
    setIsParticipantAudioEnabled(false);
  }, []);

  const handleMinimize = React.useCallback(() => {
    if (['answered', 'ended'].includes(status)) {
      setMinimized(old => !old);
    }
  }, [status]);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const run = async () => {
      callReady.current = await initCallSound();
      const myAddress = await getMyAddress();
      const nft = await getNFTbyId(route.params.nftId);
      if (nft.status === 200) {
        if (myAddress === nft.data.owner.address) {
          setParticipantPersona(nft.data.creator);
        } else {
          setParticipantPersona(nft.data.owner);
        }
      }

      const publicKey = await getMyPublicKey();
      myPublicKey.current = publicKey;
      if (route.params.isAnswering && route.params.callId) {
        callId.current = route.params.callId;
        socket.current = answerVideoCall({
          nftId: route.params.nftId,
          emitter: publicKey,
          callId: route.params.callId,
        });
      } else {
        const signature = await createSignature(route.params.nftId);
        socket.current = startVideoCall({ nftId: route.params.nftId, publicKey, signature });
      }
      socket.current.on('callAnswered', (payload: CallAnsweredParam) => onCallAnswered(payload));
      socket.current.on('callError', (payload: CallErrorParam) => onCallError(payload));
      socket.current.on('callRejected', (payload: CallRejectedParam) => onCallRejected(payload));
      socket.current.on('callEnded', (payload: CallEndedParam) => onCallEnded(payload));
      socket.current.on('callStarted', (payload: CallStartedParam) => onCallStarting(payload));
      socket.current.on('callDisconnected', () => onCallDisconnected());
      socket.current.on('callRinging', () => onCallRinging());
    };
    run();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      dispatch(setStatusBarBackground('transparent'));
      dispatch(setStatusBarTint('light'));
    });

    return () => {
      dispatch(setStatusBarTint('system'));
      unsubscribeFocus();
      cleanCallSound();
      socket.current?.disconnect();
    };
  }, [
    dispatch,
    navigation,
    onCallAnswered,
    onCallDisconnected,
    onCallEnded,
    onCallError,
    onCallRejected,
    onCallRinging,
    onCallStarting,
    route.params.callId,
    route.params.isAnswering,
    route.params.nftId,
  ]);

  return loaded ? (
    <View style={styles.container}>
      <AppMenuContainer
        backDisabled
        disableBackdrop
        enablePanDownToClose={false}
        visible={!minimized}
        snapPoints={['18%', '35%']}
        backgroundStyle={{
          backgroundColor: Color(darkTheme.colors.background).lighten(0.3).alpha(0.95).rgb().toString(),
        }}
        onDismiss={() => {}}>
        <View>
          <View style={styles.actionContainer}>
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={iconMap.cameraFlip}
              size={hp(4)}
              color={darkTheme.colors.text}
              rippleColor={darkTheme.colors.text}
              onPress={onFlipButtonPress}
              style={{
                marginHorizontal: wp(4),
                backgroundColor: isFrontCamera ? undefined : darkTheme.colors.placeholder,
              }}
            />
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={isVideoEnabled ? iconMap.videoOn : iconMap.videoOff}
              size={hp(4)}
              color={darkTheme.colors.text}
              rippleColor={darkTheme.colors.text}
              onPress={onVideoToggleButtonPress}
              style={{
                marginHorizontal: wp(4),
                backgroundColor: isVideoEnabled ? undefined : darkTheme.colors.placeholder,
              }}
            />
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={isAudioEnabled ? iconMap.micOn : iconMap.micOff}
              size={hp(4)}
              color={darkTheme.colors.text}
              rippleColor={darkTheme.colors.text}
              onPress={onMuteButtonPress}
              style={{
                marginHorizontal: wp(4),
                backgroundColor: isAudioEnabled ? undefined : darkTheme.colors.placeholder,
              }}
            />
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={iconMap.callChat}
              size={hp(4)}
              color={darkTheme.colors.text}
              rippleColor={darkTheme.colors.text}
              style={{ marginHorizontal: wp(4) }}
            />
            <AppIconButton
              icon={iconMap.callEnd}
              size={hp(4)}
              color={darkTheme.colors.text}
              rippleColor={darkTheme.colors.text}
              onPress={onEndButtonPress}
              style={{
                marginRight: wp(3),
                marginLeft: wp(2),
                width: wp(14),
                backgroundColor: defaultTheme.colors.error,
              }}
            />
          </View>
        </View>
      </AppMenuContainer>
      <AppVideoCallParticipantView
        persona={participantPersona}
        participantSid={participantVideoSid}
        trackSid={participantVideoTrackSid}
        videoOff={!isParticipantVideoEnabled}
        micOff={!isParticipantAudioEnabled}
      />
      <AppVideoCallLocalView
        persona={myPersona}
        videoOff={!isVideoEnabled}
        micOff={!isAudioEnabled}
        connected={['answered', 'ended'].includes(status)}
        minimized={minimized}
      />
      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={onRoomDidConnect}
        onRoomDidDisconnect={onRoomDidDisconnect}
        onRoomDidFailToConnect={onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
        onParticipantAddedAudioTrack={onParticipantAddedAudioTrack}
        onParticipantRemovedAudioTrack={onParticipantRemovedAudioTrack}
        onParticipantEnabledVideoTrack={onParticipantEnabledVideoTrack}
        onParticipantDisabledVideoTrack={onParticipantDisabledVideoTrack}
        onParticipantEnabledAudioTrack={onParticipantEnabledAudioTrack}
        onParticipantDisabledAudioTrack={onParticipantDisabledAudioTrack}
      />
      {route.params.isAnswering && route.params.callId ? null : (
        <AppVideoCallHeader
          status={status}
          persona={participantPersona}
          connected={['answered', 'ended'].includes(status)}
        />
      )}
      <TouchableWithoutFeedback onPress={handleMinimize}>
        <View style={styles.touchableContainer} />
      </TouchableWithoutFeedback>
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: hp(2),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    touchableContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
  });
