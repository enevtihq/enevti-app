import { View, Platform, PermissionsAndroid, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Socket } from 'socket.io-client';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { RoomErrorEventCb, RoomEventCb, TrackEventCb, TwilioVideo } from 'react-native-twilio-video-webrtc';
import { getMyAddress, getMyPublicKey, parsePersonaLabel, publicKeyToBase32 } from 'enevti-app/service/enevti/persona';
import { createSignature, decryptAsymmetric, encryptAsymmetric } from 'enevti-app/utils/cryptography';
import { answerVideoCall, appSocket, startVideoCall } from 'enevti-app/utils/network';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusBarBackground, setStatusBarTint } from 'enevti-app/store/slices/ui/global/statusbar';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import AppVideoCallLocalView from './AppVideoCallLocalView';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import {
  CallAnsweredParam,
  CallEndedParam,
  CallErrorParam,
  CallReconnectedParam,
  CallRefreshedParam,
  CallRejectedParam,
  CallStartedParam,
  CallStatus,
  ChatMessage,
  OwnerRespondToSetStatusParam,
  SomeoneIsCallingParam,
  TipReceived,
  TokenReceivedParam,
  VideoCallStatusChangedParams,
} from 'enevti-app/types/core/service/call';
import defaultTheme, { Theme } from 'enevti-app/theme/default';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppVideoCallParticipantView from './AppVideoCallParticipantView';
import { Persona } from 'enevti-app/types/core/account/persona';
import { getNFTActivity, getNFTbyId } from 'enevti-app/service/enevti/nft';
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
import AppAlertModal from '../../menu/AppAlertModal';
import AppConfirmationModal from '../../menu/AppConfirmationModal';
import sleep from 'enevti-app/utils/dummy/sleep';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { Divider, useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppCountdown from 'enevti-app/components/atoms/date/AppCountdown';
import { getRedeemEndTimeUTC } from 'enevti-app/utils/date/redeemDate';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { paySetVideoCallAnswered } from 'enevti-app/store/middleware/thunk/payment/creator/paySetVideoCallAnswered';
import { paySetVideoCallRejected } from 'enevti-app/store/middleware/thunk/payment/creator/paySetVideoCallRejected';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import AppVideoCallChat from './AppVideoCallChat';
import AppVideoCallChatFloatingNotification from './AppVideoCallChatFloatingNotification';
import AppBadge from 'enevti-app/components/atoms/view/AppBadge';
import AppVideoCallTipModal from './AppVideoCallTipModal';
import { payTransferToken } from 'enevti-app/store/middleware/thunk/payment/creator/payTransferToken';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';

interface AppRedeemVideoCallProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'RedeemVideoCall'>;
}

const RECONNECTION_TIMEOUT = 60000;
const MINIMIZED_DELAY = 2000;
const DISCONNECT_DELAY = 3000;
const CREATOR_ASK_TO_SET_STATUS_LIMIT_SEC = 10;

export default function AppRedeemVideoCall({ navigation, route }: AppRedeemVideoCallProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const socket = React.useRef<Socket | undefined>();
  const nftSocket = React.useRef<Socket | undefined>();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const myPersona = useSelector(selectMyPersonaCache);
  const [tipModalShow, setTipModalShow] = React.useState<boolean>(false);
  const [newChatBadge, setNewChatBadge] = React.useState<boolean>(false);
  const [newChatShow, setNewChatShow] = React.useState<boolean>(false);
  const [newChat, setNewChat] = React.useState<string>('');
  const [chat, setChat] = React.useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [chatShow, setChatShow] = React.useState<boolean>(false);
  const chatShowRef = React.useRef<boolean>(false);
  const [rejectedModalShow, setRejectedModalShow] = React.useState<boolean>(false);
  const [answeredModalShow, setAnsweredModalShow] = React.useState<boolean>(false);
  const [someoneIsCalling, setSomeoneIsCalling] = React.useState<boolean>(false);
  const [timesUp, setTimesUp] = React.useState<boolean>(false);
  const [timesUpModalShow, setTimesUpModalShow] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [internetAvailable, setInternetAvailable] = React.useState<boolean>(true);
  const [nft, setNft] = React.useState<NFT>();
  const nftRef = React.useRef<NFT>();
  const timeoutCountdown = React.useRef<number>(RECONNECTION_TIMEOUT);
  const [until, setUntil] = React.useState<number>(0);
  const [callStatusChain, setCallStatusChain] = React.useState<string>();
  const [callStatusChainLabel, setCallStatusChainLabel] = React.useState<string>(t('redeem:VCLoading'));

  const [creatorIsAskingToSetStatus, setCreatorIsAskingToSetStatus] = React.useState<boolean>(false);
  const [creatorAskToSetStatusCount, setCreatorIsAskingToSetStatusCount] = React.useState<number>(
    CREATOR_ASK_TO_SET_STATUS_LIMIT_SEC,
  );

  const [myPublicKey, setMyPublicKey] = React.useState<string>('');
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
  const [callMode, setCallMode] = React.useState<'owner' | 'creator' | ''>('');
  const callModeRef = React.useRef<'owner' | 'creator' | ''>('');
  const [participantPersona, setParticipantPersona] = React.useState<Persona | undefined>();
  const [callStatusActionLoading, setCallStatusActionLoading] = React.useState<boolean>(false);
  const markCallStatusButtonDisabled = React.useMemo(
    () => !['answered', 'ended'].includes(status) || nft === undefined || (nft && nft.redeem.count > 0),
    [nft, status],
  );

  const twilioRef = React.useRef<TwilioVideo>(null);
  const tipAmountRef = React.useRef<string>('');
  const myPublicKeyRef = React.useRef<string>('');
  const participantPublicKeyRef = React.useRef<string>('');
  const callId = React.useRef<string>('');
  const token = React.useRef<string>('');
  const signature = React.useRef<string>('');
  const isRoomDidConnect = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<any>();
  const timeoutIntervalRef = React.useRef<any>();
  const internetTimeoutRef = React.useRef<any>();
  const creatorAskToSetStatusTimeoutRef = React.useRef<any>();
  const creatorAskToSetStatusCountRef = React.useRef<any>(0);
  const someoneIsCallingNftId = React.useRef<string>('');
  const abortController = React.useRef<AbortController>();
  const callRejectedRef = React.useRef<CallRejectedParam>({ nftId: '', emitter: '', signature: '' });

  const onVideoCallStatusChanged = React.useCallback(
    async (_param: VideoCallStatusChangedParams) => {
      const nftResponse = await getNFTbyId(route.params.nftId, abortController.current?.signal);
      if (nftResponse.status === 200) {
        setNft(nftResponse.data);
        nftRef.current = nftResponse.data;
        if (nftResponse.data.redeem.count > 0) {
          const nftActivity = await getNFTActivity(route.params.nftId, 0, 1, 0, abortController.current?.signal);
          if (nftActivity.status === 200) {
            setCallStatusChain(nftActivity.data.data[0].name);
          }
        }
      }
    },
    [route.params.nftId],
  );

  const onCallStarting = React.useCallback(async (param: CallStartedParam) => {
    callId.current = param.callId;
    setLoaded(true);
    if (myPublicKeyRef.current && myPublicKeyRef.current === param.emitter) {
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
        const onCallAnsweredTimeout = setTimeout(() => {
          setMinimized(true);
          clearTimeout(onCallAnsweredTimeout);
        }, MINIMIZED_DELAY);
      } else {
        stopCallingSound();
        playCallAnswerSound();
        setMinimized(true);
      }
      if (token.current) {
        twilioRef.current?.connect({ accessToken: token.current });
      } else if (myPublicKeyRef.current && myPublicKeyRef.current === param.emitter) {
        token.current = param.twilioToken;
        twilioRef.current?.connect({ accessToken: param.twilioToken });
      }
      setStatus('answered');
    },
    [route.params.callId, route.params.isAnswering],
  );

  const onTokenReceived = React.useCallback(async (param: TokenReceivedParam) => {
    if (myPublicKeyRef.current && myPublicKeyRef.current === param.emitter) {
      setLoaded(true);
      token.current = param.twilioToken;
      twilioRef.current?.connect({ accessToken: param.twilioToken });
      const onTokenReceivedTimeout = setTimeout(() => {
        setMinimized(true);
        clearTimeout(onTokenReceivedTimeout);
      }, MINIMIZED_DELAY);
      setStatus('answered');
    }
  }, []);

  const cleanCall = React.useCallback(async () => {
    twilioRef.current?.disconnect();
    socket.current?.disconnect();
    nftSocket.current?.disconnect();
    clearTimeout(timeoutRef.current);
    clearTimeout(internetTimeoutRef.current);
    clearInterval(timeoutIntervalRef.current);
    clearInterval(creatorAskToSetStatusTimeoutRef.current);
    timeoutCountdown.current = RECONNECTION_TIMEOUT;
    dispatch(resetModalLoaderState());

    stopCallingSound();
    stopCallBusySound();
  }, [dispatch]);

  const onExitCall = React.useCallback(async () => {
    cleanCall();
    playCallEndSound(() => {
      navigation.goBack();
    });
  }, [cleanCall, navigation]);

  const onCallRejected = React.useCallback(
    async (_param: CallRejectedParam) => {
      setStatus('rejected');
      if (callModeRef.current === 'owner' && nftRef.current?.redeem.count === 0) {
        callRejectedRef.current = _param;
        cleanCall();
        playCallEndSound();
        setRejectedModalShow(true);
      } else {
        await onExitCall();
      }
    },
    [cleanCall, onExitCall],
  );

  const onCallRefreshed = React.useCallback(async (_param: CallRefreshedParam) => {
    if (token.current && myPublicKeyRef.current !== _param.emitter) {
      twilioRef.current?.disconnect();
      await sleep(DISCONNECT_DELAY);
      twilioRef.current?.connect({ accessToken: token.current });
    }
  }, []);

  const onCallReconnected = React.useCallback(
    async (_param: CallReconnectedParam) => {
      dispatch(hideModalLoader());
      clearTimeout(timeoutRef.current);
      clearTimeout(internetTimeoutRef.current);
      clearInterval(timeoutIntervalRef.current);
      timeoutCountdown.current = RECONNECTION_TIMEOUT;
      stopCallBusySound();

      if (!token.current) {
        callId.current = _param.callId;
        twilioRef.current?.connect({ accessToken: '' });
        await sleep(DISCONNECT_DELAY);
        socket.current?.emit('requestToken', {
          nftId: route.params.nftId,
          callId: _param.callId,
          emitter: myPublicKeyRef.current,
          signature: signature.current,
        });
      } else if (!isRoomDidConnect.current) {
        twilioRef.current?.disconnect();
        await sleep(DISCONNECT_DELAY);
        twilioRef.current?.connect({ accessToken: token.current });
      }
    },
    [dispatch, route.params.nftId],
  );

  const onCallBusy = React.useCallback(async () => {
    setBusy(true);
  }, []);

  const onCallEnded = React.useCallback(
    async (param: CallEndedParam) => {
      setStatus('ended');
      if (callModeRef.current === 'owner' && nftRef.current?.redeem.count === 0) {
        cleanCall();
        playCallEndSound();
        setAnsweredModalShow(true);
      } else if (param.emitter !== myPublicKeyRef.current) {
        await onExitCall();
      }
    },
    [cleanCall, onExitCall],
  );

  const onCallError = React.useCallback(
    async (_param: CallErrorParam | any) => {
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
        emitter: myPublicKeyRef.current,
        signature: signature.current,
      });
      setStatus('ended');
      if (callModeRef.current === 'owner' && nftRef.current?.redeem.count === 0) {
        cleanCall();
        playCallEndSound();
        setAnsweredModalShow(true);
        return;
      }
    } else {
      setStatus('exited');
    }
    await onExitCall();
  }, [cleanCall, onExitCall, route.params.nftId, status]);

  const onSetStatusCallChainAnsweredCA = React.useCallback(() => {
    if (nftRef.current) {
      dispatch(paySetVideoCallAnswered({ key: `CA:${route.key}`, nft: nftRef.current }));
    }
  }, [dispatch, route.key]);

  const onSetStatusCallChainAnswered = React.useCallback(() => {
    if (nftRef.current) {
      dispatch(paySetVideoCallAnswered({ key: route.key, nft: nftRef.current }));
    }
  }, [dispatch, route.key]);

  const onSetStatusCallChainRejected = React.useCallback(() => {
    if (nftRef.current) {
      dispatch(
        paySetVideoCallRejected({
          key: route.key,
          nft: nftRef.current,
          signature: callRejectedRef.current.signature,
          publicKey: callRejectedRef.current.emitter,
        }),
      );
    }
  }, [dispatch, route.key]);

  const onCreatorAskToSetStatusBase = React.useCallback(() => {
    setCreatorIsAskingToSetStatus(false);
    creatorAskToSetStatusCountRef.current = 0;
    setCreatorIsAskingToSetStatusCount(CREATOR_ASK_TO_SET_STATUS_LIMIT_SEC);
    clearInterval(creatorAskToSetStatusTimeoutRef.current);
  }, []);

  const onCreatorAskToSetStatusNo = React.useCallback(() => {
    onCreatorAskToSetStatusBase();
    socket.current?.emit('respondToCreatorStatusAsk', {
      nftId: route.params.nftId,
      callId: callId.current,
      emitter: myPublicKeyRef.current,
      signature: signature.current,
      respond: 'declined',
    });
  }, [onCreatorAskToSetStatusBase, route.params.nftId]);

  const onCreatorAskToSetStatusYes = React.useCallback(() => {
    onCreatorAskToSetStatusBase();
    onSetStatusCallChainAnsweredCA();
  }, [onCreatorAskToSetStatusBase, onSetStatusCallChainAnsweredCA]);

  const onCreatorAskToSetStatus = React.useCallback(async () => {
    if (callModeRef.current === 'owner') {
      setCreatorIsAskingToSetStatus(true);
      creatorAskToSetStatusTimeoutRef.current = setInterval(() => {
        if (creatorAskToSetStatusCountRef.current < CREATOR_ASK_TO_SET_STATUS_LIMIT_SEC) {
          creatorAskToSetStatusCountRef.current += 1;
          setCreatorIsAskingToSetStatusCount(
            CREATOR_ASK_TO_SET_STATUS_LIMIT_SEC - creatorAskToSetStatusCountRef.current,
          );
        } else {
          onCreatorAskToSetStatusYes();
        }
      }, 1000);
    }
  }, [onCreatorAskToSetStatusYes]);

  const onOwnerRespondToSetStatus = React.useCallback(
    async (_params: OwnerRespondToSetStatusParam) => {
      if (callModeRef.current === 'creator') {
        setCallStatusActionLoading(false);
        if (_params.respond === 'accepted') {
          dispatch(showSnackbar({ mode: 'info', text: t('redeem:VCOwnerResponseAccepted') }));
        }
        if (_params.respond === 'declined') {
          dispatch(showSnackbar({ mode: 'info', text: t('redeem:VCOwnerResponseDeclined') }));
        }
        if (_params.respond === 'error') {
          dispatch(showSnackbar({ mode: 'info', text: t('redeem:VCOwnerResponseError') }));
        }
      }
    },
    [dispatch, t],
  );

  const onSomeoneIsCalling = React.useCallback(async (_param: SomeoneIsCallingParam) => {
    setSomeoneIsCalling(true);
    someoneIsCallingNftId.current = _param.nftId;
  }, []);

  const onSomeoneIsCallingYes = React.useCallback(async () => {
    await onEndButtonPress();
    navigation.navigate('NFTDetails', { mode: 'id', arg: someoneIsCallingNftId.current, redeem: true });
  }, [navigation, onEndButtonPress]);

  const onSomeoneIsCallingNo = React.useCallback(async () => {
    setSomeoneIsCalling(false);
  }, []);

  const onTimesUpButtonPress = React.useCallback(async () => {
    setTimesUpModalShow(false);
  }, []);

  const onTimesUp = React.useCallback(async () => {
    setTimesUp(true);
    setTimesUpModalShow(true);
  }, []);

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
        emitter: myPublicKeyRef.current,
        signature: signature.current,
      });
      onExitCall();
    }, RECONNECTION_TIMEOUT);
  }, [dispatch, onExitCall, route.params.nftId, t]);

  const onCallStatusActionButtonPress = React.useCallback(() => {
    if (callModeRef.current === 'owner') {
      setAnsweredModalShow(true);
    }
    if (callModeRef.current === 'creator') {
      socket.current?.emit('askOwnerToSetStatus', {
        nftId: route.params.nftId,
        callId: callId.current,
        emitter: myPublicKeyRef.current,
        signature: signature.current,
      });
      setCallStatusActionLoading(true);
      dispatch(showSnackbar({ mode: 'info', text: t('redeem:VCOwnerAsked') }));
    }
  }, [dispatch, route.params.nftId, t]);

  const onAnsweredModalOK = React.useCallback(() => {
    setAnsweredModalShow(false);
    onSetStatusCallChainAnswered();
  }, [onSetStatusCallChainAnswered]);

  const onAnsweredModalCancel = React.useCallback(() => {
    setAnsweredModalShow(false);
    if (['ended', 'exited'].includes(status)) {
      navigation.goBack();
    }
  }, [navigation, status]);

  const onRejectedModalOK = React.useCallback(() => {
    setRejectedModalShow(false);
    onSetStatusCallChainRejected();
  }, [onSetStatusCallChainRejected]);

  const onRejectedModalCancel = React.useCallback(() => {
    setRejectedModalShow(false);
    navigation.goBack();
  }, [navigation]);

  const onTipButtonPress = React.useCallback(() => {
    setTipModalShow(old => !old);
  }, []);

  const onTipModalDismiss = React.useCallback(() => {
    setTipModalShow(false);
  }, []);

  const onSendTip = React.useCallback(
    (amount: string) => {
      setTipModalShow(false);
      tipAmountRef.current = amount;
      dispatch(
        payTransferToken({
          key: route.key,
          base32: publicKeyToBase32(participantPublicKeyRef.current),
          amount: parseAmount(amount),
        }),
      );
    },
    [dispatch, route.key],
  );

  const onTipReceived = React.useCallback(
    async (param: TipReceived) => {
      if (param.sender !== myPublicKeyRef.current) {
        dispatch(
          showSnackbar({
            mode: 'info',
            text: t('redeem:VCTipReceived', { amount: parseAmount(param.amount), currency: getCoinName() }),
          }),
        );
      }
    },
    [dispatch, t],
  );

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
    if (!participantPublicKeyRef.current) {
      participantPublicKeyRef.current = participant.identity;
    }
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
    if (!participantPublicKeyRef.current) {
      participantPublicKeyRef.current = participant.identity;
    }
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

  const onChatButtonPress = React.useCallback(async () => {
    setChatShow(old => {
      chatShowRef.current = !old;
      return !old;
    });
    setNewChatBadge(false);
    if (!theme.dark) {
      await sleep(250);
      dispatch(setStatusBarTint('dark'));
    }
  }, [dispatch, theme.dark]);

  const onChatDialogDismiss = React.useCallback(async () => {
    setChatShow(false);
    chatShowRef.current = false;
    if (!theme.dark) {
      await sleep(250);
      dispatch(setStatusBarTint('light'));
    }
  }, [dispatch, theme.dark]);

  const onSendChat = React.useCallback(
    async (message: string) => {
      setChat(oldChat => [...oldChat, { sender: myPublicKeyRef.current, timestamp: Date.now(), message }]);
      const encryptedMessage = await encryptAsymmetric(message, participantPublicKeyRef.current);
      socket.current?.emit('newChatMessage', {
        nftId: route.params.nftId,
        callId: callId.current,
        emitter: myPublicKeyRef.current,
        signature: signature.current,
        message: encryptedMessage,
      });
    },
    [route.params.nftId],
  );

  const onNewChat = React.useCallback(async (param: ChatMessage) => {
    if (param.sender !== myPublicKeyRef.current) {
      const decryptedMessage = await decryptAsymmetric(param.message, participantPublicKeyRef.current);
      setChat(oldChat => [...oldChat, { ...param, message: decryptedMessage.data }]);
      if (!chatShowRef.current) {
        setNewChat(decryptedMessage.data);
        setNewChatShow(true);
        setNewChatBadge(true);
      }
    }
  }, []);

  const onNewChatFloatingPress = React.useCallback(() => {
    onChatButtonPress();
    setNewChatShow(false);
  }, [onChatButtonPress]);

  const onNewChatFloatingClose = React.useCallback(() => {
    setNewChatShow(false);
  }, []);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['setVideoCallRejected', 'setVideoCallAnswered', 'transferToken'].includes(paymentStatus.action) &&
        (paymentStatus.key === route.key || paymentStatus.key === `CA:${route.key}`)
      );
    },
    [route],
  );

  const paymentSuccessCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
      if (paymentStatus.action === 'setVideoCallRejected') {
        navigation.goBack();
      }
      if (paymentStatus.action === 'setVideoCallAnswered') {
        if (paymentStatus.key === route.key && status === 'ended') {
          navigation.goBack();
        }
        if (paymentStatus.key === `CA:${route.key}`) {
          socket.current?.emit('respondToCreatorStatusAsk', {
            nftId: route.params.nftId,
            callId: callId.current,
            emitter: myPublicKeyRef.current,
            signature: signature.current,
            respond: 'accepted',
          });
        }
      }
      if (paymentStatus.action === 'transferToken') {
        socket.current?.emit('tipSent', {
          nftId: route.params.nftId,
          callId: callId.current,
          emitter: myPublicKeyRef.current,
          signature: signature.current,
          amount: tipAmountRef.current,
        });
        tipAmountRef.current = '';
      }
    },
    [dispatch, navigation, route.key, route.params.nftId, status, t],
  );

  const paymentDismissedCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'setVideoCallRejected') {
        setRejectedModalShow(true);
      }
      if (paymentStatus.action === 'setVideoCallAnswered') {
        if (paymentStatus.key === route.key) {
          setAnsweredModalShow(true);
        }
        if (paymentStatus.key === `CA:${route.key}`) {
          onCreatorAskToSetStatus();
        }
      }
      if (paymentStatus.action === 'transferToken') {
        tipAmountRef.current = '';
      }
    },
    [onCreatorAskToSetStatus, route.key],
  );

  const paymentErrorCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'setVideoCallRejected') {
        setRejectedModalShow(true);
      }
      if (paymentStatus.action === 'setVideoCallAnswered') {
        if (paymentStatus.key === route.key) {
          setAnsweredModalShow(true);
        }
        if (paymentStatus.key === `CA:${route.key}`) {
          socket.current?.emit('respondToCreatorStatusAsk', {
            nftId: route.params.nftId,
            callId: callId.current,
            emitter: myPublicKeyRef.current,
            signature: signature.current,
            respond: 'error',
          });
        }
      }
      if (paymentStatus.action === 'transferToken') {
        tipAmountRef.current = '';
      }
    },
    [route.key, route.params.nftId],
  );

  usePaymentCallback({
    condition: paymentCondition,
    onSuccess: paymentSuccessCallback,
    onDismissed: paymentDismissedCallback,
    onError: paymentErrorCallback,
  });

  React.useEffect(() => {
    if (!nft) {
      return;
    }

    if (callMode === 'creator') {
      if (nft.redeem.count === 0) {
        if (['answered', 'ended'].includes(status)) {
          setCallStatusChainLabel(t('redeem:VCOwnerHasntSetStatus'));
        } else {
          setCallStatusChainLabel(t('redeem:VCWaitUntilAnswered'));
        }
      } else if (callStatusChain) {
        setCallStatusChainLabel(
          t('redeem:VCOwnerAlreadySetStatus', {
            status:
              callStatusChain === 'videoCallAnswered'
                ? t('redeem:VCCallStatusAnswered')
                : t('redeem:VCCallStatusRejected'),
          }),
        );
      }
    }

    if (callMode === 'owner') {
      if (nft.redeem.count === 0) {
        if (['answered', 'ended'].includes(status)) {
          setCallStatusChainLabel(t('redeem:VCYouAvailableSetStatus', { status: t('redeem:VCCallStatusAnswered') }));
        } else {
          setCallStatusChainLabel(t('redeem:VCWaitUntilAnswered'));
        }
      } else if (callStatusChain) {
        setCallStatusChainLabel(
          t('redeem:VCYouAlreadySetStatus', {
            status:
              callStatusChain === 'videoCallAnswered'
                ? t('redeem:VCCallStatusAnswered')
                : t('redeem:VCCallStatusRejected'),
          }),
        );
      }
    }
  }, [callMode, callStatusChain, nft, status, t]);

  React.useEffect(() => {
    abortController.current = new AbortController();
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const run = async () => {
      try {
        const now = Date.now();
        const myAddress = await getMyAddress();
        const nftResponse = await getNFTbyId(route.params.nftId, abortController.current?.signal);
        if (nftResponse.status === 200) {
          setNft(nftResponse.data);
          nftRef.current = nftResponse.data;
          setUntil(Math.floor((getRedeemEndTimeUTC(nftResponse.data) - now) / 1000));
          if (myAddress === nftResponse.data.owner.address) {
            setParticipantPersona(nftResponse.data.creator);
            setCallMode('owner');
            callModeRef.current = 'owner';
          } else {
            setParticipantPersona(nftResponse.data.owner);
            setCallMode('creator');
            callModeRef.current = 'creator';
          }

          if (nftResponse.data.redeem.count > 0) {
            const nftActivity = await getNFTActivity(route.params.nftId, 0, 1, 0, abortController.current?.signal);
            if (nftActivity.status === 200) {
              setCallStatusChain(nftActivity.data.data[0].name);
            } else {
              await onCallError(undefined);
            }
          }
        } else {
          await onCallError(undefined);
        }

        const publicKey = await getMyPublicKey();
        signature.current = await createSignature(route.params.nftId);
        myPublicKeyRef.current = publicKey;
        setMyPublicKey(publicKey);

        if (socket.current === undefined) {
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
        }
        socket.current.on('callAnswered', (payload: CallAnsweredParam) => onCallAnswered(payload));
        socket.current.on('callError', (payload: CallErrorParam) => onCallError(payload));
        socket.current.on('callRejected', (payload: CallRejectedParam) => onCallRejected(payload));
        socket.current.on('callEnded', (payload: CallEndedParam) => onCallEnded(payload));
        socket.current.on('callStarted', (payload: CallStartedParam) => onCallStarting(payload));
        socket.current.on('callReconnect', (payload: CallReconnectedParam) => onCallReconnected(payload));
        socket.current.on('someoneIsCalling', (payload: SomeoneIsCallingParam) => onSomeoneIsCalling(payload));
        socket.current.on('tokenReceived', (payload: TokenReceivedParam) => onTokenReceived(payload));
        socket.current.on('callRefreshed', (payload: CallRefreshedParam) => onCallRefreshed(payload));
        socket.current.on('callDisconnected', () => onCallDisconnected());
        socket.current.on('callBusy', () => onCallBusy());
        socket.current.on('callRinging', () => onCallRinging());
        socket.current.on('creatorAskToSetStatus', () => onCreatorAskToSetStatus());
        socket.current.on('newChat', (payload: ChatMessage) => onNewChat(payload));
        socket.current.on('tipReceived', (payload: TipReceived) => onTipReceived(payload));
        socket.current.on('ownerRespondToSetStatus', (payload: OwnerRespondToSetStatusParam) =>
          onOwnerRespondToSetStatus(payload),
        );

        nftSocket.current = appSocket(route.params.nftId);
        nftSocket.current.on('videoCallStatusChanged', (payload: VideoCallStatusChangedParams) =>
          onVideoCallStatusChanged(payload),
        );
      } catch {
        await onCallError(undefined);
      }
    };
    run();

    // setLoaded(true);
    // twilioRef.current?.connect({ accessToken: '' });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      dispatch(setStatusBarBackground('transparent'));
      dispatch(setStatusBarTint('light'));
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
      setInternetAvailable(!!state.isConnected);
    });

    return () => {
      abortController.current && abortController.current.abort();
      dispatch(setStatusBarTint('system'));
      unsubscribeFocus();
      unsubscribeNetInfo();
      cleanCallSound();
      socket.current?.disconnect();
      nftSocket.current?.disconnect();
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
    onCallRefreshed,
    onCallRejected,
    onCallRinging,
    onCallStarting,
    onSomeoneIsCalling,
    onTokenReceived,
    onCreatorAskToSetStatus,
    onOwnerRespondToSetStatus,
    onVideoCallStatusChanged,
    onTipReceived,
    route.params.callId,
    route.params.isAnswering,
    route.params.nftId,
    onNewChat,
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
          emitter: myPublicKeyRef.current,
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
      {callMode === 'creator' ? (
        <AppConfirmationModal
          tapEverywhereToDismiss={false}
          enablePanDownToClose={false}
          iconName={'callSomeoneIsCalling'}
          visible={someoneIsCalling}
          onDismiss={() => setSomeoneIsCalling(false)}
          title={t('redeem:VCAlertSomeoneIsCalling')}
          description={t('redeem:VCAlertSomeoneIsCallingDesc')}
          cancelText={t('redeem:VCAlertSomeoneIsCallingNo')}
          cancelOnPress={onSomeoneIsCallingNo}
          okText={t('redeem:VCAlertSomeoneIsCallingYes')}
          okOnPress={onSomeoneIsCallingYes}
        />
      ) : null}
      {callMode === 'owner' ? (
        <AppAlertModal
          tapEverywhereToDismiss={false}
          enablePanDownToClose={false}
          iconName={'callSomeoneIsCalling'}
          visible={someoneIsCalling}
          onDismiss={() => setSomeoneIsCalling(false)}
          title={t('redeem:VCAlertSomeoneIsCallingOwner')}
          description={t('redeem:VCAlertSomeoneIsCallingOwnerDesc')}
          secondaryButtonText={t('redeem:VCAlertSomeoneIsCallingOwnerButton')}
          secondaryButtonOnPress={onSomeoneIsCallingNo}
        />
      ) : null}
      <AppAlertModal
        tapEverywhereToDismiss={false}
        enablePanDownToClose={false}
        iconName={'timesUp'}
        visible={timesUpModalShow}
        onDismiss={() => setTimesUpModalShow(false)}
        title={t('redeem:VCAlertTimesUpTitle')}
        description={t('redeem:VCAlertTimesUpDesc')}
        secondaryButtonText={t('redeem:VCAlertTimesUpButton')}
        secondaryButtonOnPress={onTimesUpButtonPress}
      />
      <AppConfirmationModal
        tapEverywhereToDismiss={false}
        enablePanDownToClose={false}
        iconName={'creatorAskToSetStatus'}
        visible={creatorIsAskingToSetStatus}
        onDismiss={() => setCreatorIsAskingToSetStatus(false)}
        title={t('redeem:VCCreatorAskToSetStatusTitle')}
        description={t('redeem:VCCreatorAskToSetStatusDesc')}
        cancelText={t('redeem:VCCreatorAskToSetStatusNo')}
        cancelOnPress={onCreatorAskToSetStatusNo}
        okText={`${t('redeem:VCCreatorAskToSetStatusYes')} (${creatorAskToSetStatusCount})`}
        okOnPress={onCreatorAskToSetStatusYes}
      />
      <AppConfirmationModal
        tapEverywhereToDismiss={false}
        enablePanDownToClose={false}
        iconName={'setVideoCallRejected'}
        visible={rejectedModalShow}
        onDismiss={() => setRejectedModalShow(false)}
        title={t('redeem:VCDoYouWantToRejectTitle')}
        description={t('redeem:VCDoYouWantToRejectDesc')}
        cancelText={t('redeem:VCDoYouWantToRejectNo')}
        cancelOnPress={onRejectedModalCancel}
        okText={`${t('redeem:VCDoYouWantToRejectYes')}`}
        okOnPress={onRejectedModalOK}
      />
      <AppConfirmationModal
        tapEverywhereToDismiss={false}
        enablePanDownToClose={false}
        iconName={'setVideoCallAnswered'}
        visible={answeredModalShow}
        onDismiss={() => setAnsweredModalShow(false)}
        title={t('redeem:VCDoYouWantToAnswerTitle')}
        description={t('redeem:VCDoYouWantToAnswerDesc')}
        cancelText={t('redeem:VCDoYouWantToAnswerNo')}
        cancelOnPress={onAnsweredModalCancel}
        okText={`${t('redeem:VCDoYouWantToAnswerYes')}`}
        okOnPress={onAnsweredModalOK}
      />
      <AppVideoCallChat
        chat={chat}
        onSendChat={onSendChat}
        myPublicKey={myPublicKey}
        visible={chatShow}
        participantPersona={participantPersona}
        onDismiss={onChatDialogDismiss}
      />
      <AppVideoCallChatFloatingNotification
        show={newChatShow}
        label={newChat}
        participantPersona={participantPersona}
        onPress={onNewChatFloatingPress}
        onClose={onNewChatFloatingClose}
      />
      {tipModalShow ? (
        <AppVideoCallTipModal show={tipModalShow} onDismiss={onTipModalDismiss} onSendTip={onSendTip} />
      ) : null}
      <AppMenuContainer
        backDisabled
        disableBackdrop
        enablePanDownToClose={false}
        visible={!minimized}
        snapPoints={['18%', '60%']}
        backgroundStyle={{
          backgroundColor: Color(theme.colors.background).lighten(0.3).alpha(0.95).rgb().toString(),
        }}
        onDismiss={() => {}}>
        <View>
          <View style={styles.actionContainer}>
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={iconMap.cameraFlip}
              size={hp(4)}
              color={theme.colors.text}
              rippleColor={theme.colors.text}
              onPress={onFlipButtonPress}
              style={{
                marginHorizontal: wp(5),
                backgroundColor: isFrontCamera ? undefined : theme.colors.placeholder,
              }}
            />
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={isVideoEnabled ? iconMap.videoOn : iconMap.videoOff}
              size={hp(4)}
              color={theme.colors.text}
              rippleColor={theme.colors.text}
              onPress={onVideoToggleButtonPress}
              style={{
                marginHorizontal: wp(5),
                backgroundColor: isVideoEnabled ? undefined : theme.colors.placeholder,
              }}
            />
            <AppIconButton
              disabled={!['answered', 'ended'].includes(status)}
              icon={isAudioEnabled ? iconMap.micOn : iconMap.micOff}
              size={hp(4)}
              color={theme.colors.text}
              rippleColor={theme.colors.text}
              onPress={onMuteButtonPress}
              style={{
                marginHorizontal: wp(5),
                backgroundColor: isAudioEnabled ? undefined : theme.colors.placeholder,
              }}
            />
            <AppIconButton
              icon={iconMap.callEnd}
              size={hp(4)}
              color={'white'}
              rippleColor={'white'}
              onPress={onEndButtonPress}
              style={{
                marginRight: wp(4),
                marginLeft: wp(3),
                width: wp(14),
                backgroundColor: defaultTheme.colors.error,
              }}
            />
          </View>
          {participantPersona ? (
            <View>
              <AppListItem
                containerStyle={styles.accountCard}
                leftContent={
                  <View style={styles.collectionCoverContainer}>
                    <AppAvatarRenderer persona={participantPersona} size={wp('12%', insets)} style={styles.avatar} />
                  </View>
                }
                rightContent={
                  <View style={styles.avatarAction}>
                    <AppIconButton
                      disabled={!['answered', 'ended'].includes(status)}
                      icon={iconMap.dollar}
                      size={hp(3.5)}
                      color={theme.colors.text}
                      rippleColor={theme.colors.text}
                      style={styles.avatarActionButton}
                      onPress={onTipButtonPress}
                    />
                    <View style={styles.avatarActionButton}>
                      <AppIconButton
                        disabled={!['answered', 'ended'].includes(status)}
                        icon={iconMap.callChat}
                        size={hp(3.5)}
                        color={theme.colors.text}
                        rippleColor={theme.colors.text}
                        onPress={onChatButtonPress}
                      />
                      {newChatBadge ? <AppBadge /> : null}
                    </View>
                  </View>
                }>
                <AppTextHeading3 numberOfLines={1} style={{ color: theme.colors.text }}>
                  {parsePersonaLabel(participantPersona)}
                </AppTextHeading3>
                {participantPersona.username ? (
                  <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
                    {participantPersona.base32}
                  </AppTextBody4>
                ) : null}
              </AppListItem>
              {nft ? (
                <View style={styles.nftInfoContainer}>
                  <View style={styles.nftInfoRow}>
                    <View style={styles.nftInfoIMG}>
                      <AppNFTRenderer nft={nft} width={wp(25)} />
                    </View>
                    <View style={styles.nftInfoTextContainer}>
                      <View style={{ height: hp(2.8) }}>
                        <AppTextHeading3 style={styles.nftInfoText}>{`${nft.symbol}#${nft.serial}`}</AppTextHeading3>
                      </View>
                      <Divider style={styles.divider} />
                      {['answered', 'ended'].includes(status) ? (
                        timesUp ? (
                          <AppTextBody3 style={styles.nftInfoText}>{t('redeem:VCTimesUp')}</AppTextBody3>
                        ) : (
                          <>
                            <AppTextBody5 style={styles.remainingTimeText}>{t('redeem:VCRemainingTime')}</AppTextBody5>
                            <AppCountdown theme={theme} until={until} onFinish={onTimesUp} />
                          </>
                        )
                      ) : (
                        <AppTextBody3 style={styles.nftInfoText}>{t('redeem:VCNotAnsweredYet')}</AppTextBody3>
                      )}
                    </View>
                  </View>
                </View>
              ) : null}
              <AppTextBody5 style={styles.callStatusDesc}>{callStatusChainLabel}</AppTextBody5>
              <AppPrimaryButton
                onPress={onCallStatusActionButtonPress}
                loading={callStatusActionLoading}
                disabled={markCallStatusButtonDisabled}
                style={{ marginHorizontal: wp(5) }}
                theme={theme}>
                {callMode === 'owner' ? t('redeem:VCMarkAsAcceptedButton') : t('redeem:VCAskOwnerToAcceptButton')}
              </AppPrimaryButton>
            </View>
          ) : null}
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
      <AppAlertModal
        visible={busy}
        enablePanDownToClose={false}
        iconName={'callBusy'}
        onDismiss={() => {}}
        title={t('redeem:VCAlertBusyTitle')}
        description={t('redeem:VCAlertBusyDescription')}
        secondaryButtonText={t('redeem:VCAlertBusyButton')}
        secondaryButtonOnPress={onEndButtonPress}
      />
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    callStatusDesc: {
      textAlign: 'center',
      marginBottom: hp(1.5),
      color: theme.colors.text,
    },
    divider: {
      marginVertical: wp('2%', insets),
      backgroundColor: Color(theme.colors.text).alpha(0.1).rgb().toString(),
    },
    nftInfoContainer: {
      marginHorizontal: wp('5%', insets),
      marginBottom: hp('3%', insets),
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      backgroundColor: Color(theme.colors.background).lighten(0.3).alpha(0.95).rgb().toString(),
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      overflow: 'hidden',
    },
    nftInfoRow: {
      flexDirection: 'row',
    },
    nftInfoIMG: {
      width: wp(25),
      alignSelf: 'center',
    },
    nftInfoTextContainer: {
      flex: 1,
      alignSelf: 'center',
      marginLeft: wp(5),
      marginTop: wp(2),
    },
    nftInfoText: {
      color: theme.colors.text,
      textAlign: 'center',
    },
    remainingTimeText: {
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: hp(1),
    },
    accountCard: {
      marginVertical: hp('3%', insets),
      backgroundColor: Color(theme.colors.background).lighten(0.3).alpha(0.95).rgb().toString(),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
    collectionCoverContainer: {
      marginRight: wp('3%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    avatar: {
      alignSelf: 'center',
    },
    avatarActionButton: {
      alignSelf: 'center',
      marginHorizontal: wp(2),
    },
    avatarAction: {
      flexDirection: 'row',
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
