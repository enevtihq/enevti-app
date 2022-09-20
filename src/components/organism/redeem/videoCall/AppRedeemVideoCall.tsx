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
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import {
  CallAnsweredParam,
  CallEndedParam,
  CallErrorParam,
  CallReconnectedParam,
  CallRejectedParam,
  CallStartedParam,
  CallStatus,
  SomeoneIsCallingParam,
} from 'enevti-app/types/core/service/call';
import defaultTheme from 'enevti-app/theme/default';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppVideoCallParticipantView from './AppVideoCallParticipantView';
import { Persona } from 'enevti-app/types/core/account/persona';
import { getNFTbyId } from 'enevti-app/service/enevti/nft';
import AppVideoCallHeader from './AppVideoCallHeader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import {
  cleanCallSound,
  playCallAnswerSound,
  playCallBusySound,
  playCallEndSound,
  playCallingSound,
  stopCallBusySound,
  stopCallingSound,
} from 'enevti-app/service/call/device/sound';
import { NFT } from 'enevti-app/types/core/chain/nft';
import {
  hideModalLoader,
  resetModalLoaderState,
  setModalLoaderState,
  setModalLoaderSubText,
} from 'enevti-app/store/slices/ui/global/modalLoader';

interface AppRedeemVideoCallProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'RedeemVideoCall'>;
}

const RECONNECTION_TIMEOUT = 60000;

export default function AppRedeemVideoCall({ navigation, route }: AppRedeemVideoCallProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = React.useRef<Socket | undefined>();
  const styles = React.useMemo(() => makeStyles(), []);

  const myPersona = useSelector(selectMyPersonaCache);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [disconnected, setDisconnected] = React.useState<boolean>(false);
  const [someoneIsCalling, setSomeoneIsCalling] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [internetAvailable, setInternetAvailable] = React.useState<boolean>(true);
  const [nft, setNft] = React.useState<NFT>();
  const timeoutCountdown = React.useRef<number>(RECONNECTION_TIMEOUT);

  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isParticipantAudioEnabled, setIsParticipantAudioEnabled] = React.useState(false);
  const [isParticipantVideoEnabled, setIsParticipantVideoEnabled] = React.useState(false);
  const [isFrontCamera, setIsFrontCamera] = React.useState(true);
  const [status, setStatus] = React.useState<CallStatus>('authorizing');
  const [participantVideoSid, setParticipantVideoSid] = React.useState<string>('');
  const [participantVideoTrackSid, setParticipantVideoTrackSid] = React.useState<string>('');
  const [, setParticipantAudioSid] = React.useState<string>('');
  const [, setParticipantAudioTrackSid] = React.useState<string>('');
  const twilioRef = React.useRef<TwilioVideo>(null);
  const myPublicKey = React.useRef<string>('');
  const callId = React.useRef<string>('');
  const token = React.useRef<string>('');
  const signature = React.useRef<string>('');
  const isRoomDidConnect = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<any>();
  const timeoutIntervalRef = React.useRef<any>();
  const internetTimeoutRef = React.useRef<any>();
  const [participantPersona, setParticipantPersona] = React.useState<Persona | undefined>();

  const onCallStarting = React.useCallback(async (param: CallStartedParam) => {
    callId.current = param.callId;
    setLoaded(true);
    if (myPublicKey.current && myPublicKey.current === param.emitter) {
      token.current = param.twilioToken;
      twilioRef.current?.connect({ accessToken: '' });
      playCallingSound();
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
        stopCallingSound();
        playCallAnswerSound();
        setMinimized(true);
      }
      if (token.current) {
        twilioRef.current?.connect({ accessToken: token.current });
      } else if (myPublicKey.current && myPublicKey.current === param.emitter) {
        token.current = param.twilioToken;
        twilioRef.current?.connect({ accessToken: param.twilioToken });
      }
      setStatus('answered');
    },
    [route.params.callId, route.params.isAnswering],
  );

  const onExitCall = React.useCallback(async () => {
    twilioRef.current?.disconnect();
    socket.current?.disconnect();
    clearTimeout(timeoutRef.current);
    clearTimeout(internetTimeoutRef.current);
    clearInterval(timeoutIntervalRef.current);
    timeoutCountdown.current = RECONNECTION_TIMEOUT;
    dispatch(resetModalLoaderState());

    stopCallingSound();
    stopCallBusySound();

    playCallEndSound(() => {
      navigation.goBack();
    });
  }, [dispatch, navigation]);

  const onCallRejected = React.useCallback(
    async (_param: CallRejectedParam) => {
      setStatus('rejected');
      await onExitCall();
    },
    [onExitCall],
  );

  const onCallReconnected = React.useCallback(
    async (_param: CallReconnectedParam) => {
      dispatch(hideModalLoader());
      clearTimeout(timeoutRef.current);
      clearTimeout(internetTimeoutRef.current);
      clearInterval(timeoutIntervalRef.current);
      timeoutCountdown.current = RECONNECTION_TIMEOUT;
      stopCallBusySound();
      setDisconnected(false);
      if (token.current && !isRoomDidConnect.current) {
        twilioRef.current?.disconnect();
        twilioRef.current?.connect({ accessToken: token.current });
      }
    },
    [dispatch],
  );

  const onSomeoneIsCalling = React.useCallback(async (_param: SomeoneIsCallingParam) => {
    setSomeoneIsCalling(true);
  }, []);

  const onCallBusy = React.useCallback(async () => {
    setBusy(true);
  }, []);

  const onCallEnded = React.useCallback(
    async (param: CallEndedParam) => {
      setStatus('ended');
      if (param.emitter !== myPublicKey.current) {
        await onExitCall();
      }
    },
    [onExitCall],
  );

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
      socket.current?.emit('ended', {
        nftId: route.params.nftId,
        callId: callId.current,
        emitter: myPublicKey.current,
        signature: signature.current,
      });
    } else {
      setStatus('exited');
    }
    await onExitCall();
  }, [onExitCall, route.params.nftId, status]);

  const onCallDisconnected = React.useCallback(async () => {
    playCallBusySound();
    dispatch(
      setModalLoaderState({
        show: true,
        text: t('redeem:VCSreconnecting'),
        subtext: t('redeem:VCSreconnectingSubtext', { countdown: Math.floor(RECONNECTION_TIMEOUT / 1000) }),
      }),
    );
    timeoutIntervalRef.current = setInterval(() => {
      timeoutCountdown.current -= 1000;
      dispatch(
        setModalLoaderSubText(
          t('redeem:VCSreconnectingSubtext', { countdown: Math.floor(timeoutCountdown.current / 1000) }),
        ),
      );
    }, 1000);
    timeoutRef.current = setTimeout(() => {
      socket.current?.emit('ended', {
        nftId: route.params.nftId,
        callId: callId.current,
        emitter: myPublicKey.current,
        signature: signature.current,
      });
      onExitCall();
    }, RECONNECTION_TIMEOUT);
    setDisconnected(true);
  }, [dispatch, onExitCall, route.params.nftId, t]);

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

  const onRoomDidConnect: RoomEventCb = React.useCallback(() => {
    isRoomDidConnect.current = true;
  }, []);

  const onRoomDidDisconnect: RoomErrorEventCb = React.useCallback(async () => {
    isRoomDidConnect.current = false;
  }, []);

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
      const myAddress = await getMyAddress();
      const nftResponse = await getNFTbyId(route.params.nftId);
      if (nftResponse.status === 200) {
        setNft(nftResponse.data);
        if (myAddress === nftResponse.data.owner.address) {
          setParticipantPersona(nftResponse.data.creator);
        } else {
          setParticipantPersona(nftResponse.data.owner);
        }
      }

      const publicKey = await getMyPublicKey();
      signature.current = await createSignature(route.params.nftId);
      myPublicKey.current = publicKey;
      if (route.params.isAnswering && route.params.callId) {
        callId.current = route.params.callId;
        socket.current = answerVideoCall({
          nftId: route.params.nftId,
          emitter: publicKey,
          callId: route.params.callId,
          signature: signature.current,
        });
      } else {
        socket.current = startVideoCall({ nftId: route.params.nftId, publicKey, signature: signature.current });
      }
      socket.current.on('callAnswered', (payload: CallAnsweredParam) => onCallAnswered(payload));
      socket.current.on('callError', (payload: CallErrorParam) => onCallError(payload));
      socket.current.on('callRejected', (payload: CallRejectedParam) => onCallRejected(payload));
      socket.current.on('callEnded', (payload: CallEndedParam) => onCallEnded(payload));
      socket.current.on('callStarted', (payload: CallStartedParam) => onCallStarting(payload));
      socket.current.on('callReconnect', (payload: CallReconnectedParam) => onCallReconnected(payload));
      socket.current.on('someoneIsCalling', (payload: SomeoneIsCallingParam) => onSomeoneIsCalling(payload));
      socket.current.on('callDisconnected', () => onCallDisconnected());
      socket.current.on('callBusy', () => onCallBusy());
      socket.current.on('callRinging', () => onCallRinging());
    };
    run();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      dispatch(setStatusBarBackground('transparent'));
      dispatch(setStatusBarTint('light'));
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
      setInternetAvailable(!!state.isConnected);
    });

    return () => {
      dispatch(setStatusBarTint('system'));
      unsubscribeFocus();
      unsubscribeNetInfo();
      cleanCallSound();
      socket.current?.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, [
    dispatch,
    navigation,
    onCallAnswered,
    onCallBusy,
    onCallDisconnected,
    onCallEnded,
    onCallError,
    onCallReconnected,
    onCallRejected,
    onCallRinging,
    onCallStarting,
    onSomeoneIsCalling,
    route.params.callId,
    route.params.isAnswering,
    route.params.nftId,
  ]);

  React.useEffect(() => {
    if (!internetAvailable) {
      dispatch(
        setModalLoaderState({
          show: true,
          text: t('redeem:VCSreconnecting'),
          subtext: t('redeem:VCSreconnectingSubtext', { countdown: Math.floor(RECONNECTION_TIMEOUT / 1000) }),
        }),
      );
      timeoutIntervalRef.current = setInterval(() => {
        timeoutCountdown.current -= 1000;
        dispatch(
          setModalLoaderSubText(
            t('redeem:VCSreconnectingSubtext', { countdown: Math.floor(timeoutCountdown.current / 1000) }),
          ),
        );
      }, 1000);
      internetTimeoutRef.current = setTimeout(() => {
        socket.current?.emit('ended', {
          nftId: route.params.nftId,
          callId: callId.current,
          emitter: myPublicKey.current,
          signature: signature.current,
        });
        onExitCall();
      }, RECONNECTION_TIMEOUT);
      playCallBusySound();
      return () => {
        clearTimeout(internetTimeoutRef.current);
        clearInterval(timeoutIntervalRef.current);
        timeoutCountdown.current = RECONNECTION_TIMEOUT;
        stopCallBusySound();
      };
    } else {
      dispatch(hideModalLoader());
    }
  }, [dispatch, internetAvailable, onExitCall, route.params.nftId, t]);

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
