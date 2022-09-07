import { View, Text, Platform, PermissionsAndroid, StatusBar } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { Socket } from 'socket.io-client';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { TwilioVideo, TwilioVideoLocalView, TwilioVideoParticipantView } from 'react-native-twilio-video-webrtc';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';
import { videoCallSocket } from 'enevti-app/utils/network';
import { useDispatch } from 'react-redux';
import {
  resetStatusBarState,
  setStatusBarBackground,
  setStatusBarTint,
} from 'enevti-app/store/slices/ui/global/statusbar';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from '@react-native-community/blur';
import Color from 'color';
import darkTheme from 'enevti-app/theme/dark';
import defaultTheme from 'enevti-app/theme/default';
import AppVideoCallLocalView from './AppVideoCallLocalView';

interface AppRedeemVideoCallProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'RedeemVideoCall'>;
}

export default function AppRedeemVideoCall({ navigation, route }: AppRedeemVideoCallProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const socket = React.useRef<Socket | undefined>();

  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [status, setStatus] = React.useState('disconnected');
  const [participants, setParticipants] = React.useState(new Map());
  const [videoTracks, setVideoTracks] = React.useState(new Map());
  const [token, setToken] = React.useState('');
  const twilioRef = React.useRef<TwilioVideo>(null);

  const _onConnectButtonPress = async () => {
    twilioRef.current?.connect({
      accessToken: '',
    });
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioRef.current?.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current?.setLocalAudioEnabled(!isAudioEnabled).then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current?.flipCamera();
  };

  const _onRoomDidConnect = ({ roomName }) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([...videoTracks, [track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid }]]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    twilioRef.current?.connect({ accessToken: '' });

    // const run = async () => {
    //   const publicKey = await getMyPublicKey();
    //   const signature = await createSignature(route.params.nft.id);
    //   socket.current = videoCallSocket({ nftId: route.params.nft.id, publicKey, signature }, true);
    // };
    // run();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      dispatch(setStatusBarBackground('transparent'));
      dispatch(setStatusBarTint('light'));
    });
    return () => {
      dispatch(setStatusBarTint('system'));
      unsubscribeFocus();
      // socket.current?.disconnect();
    };
  }, [dispatch, navigation, route.params.nft.id]);

  return (
    <View style={{ flex: 1 }}>
      <AppMenuContainer
        transparentBackdrop
        enablePanDownToClose={false}
        visible={true}
        snapPoints={['18%', '35%']}
        backgroundStyle={{ backgroundColor: Color(darkTheme.colors.background).alpha(0.95).rgb().toString() }}
        onDismiss={() => {}}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: hp(2) }}>
            <AppIconButton
              disabled
              icon={iconMap.videoOn}
              size={hp(4)}
              color={darkTheme.colors.text}
              style={{ marginHorizontal: wp(6) }}
            />
            <AppIconButton
              disabled
              icon={iconMap.micOn}
              size={hp(4)}
              color={darkTheme.colors.text}
              style={{ marginHorizontal: wp(6) }}
            />
            <AppIconButton
              disabled
              icon={iconMap.callChat}
              size={hp(4)}
              color={darkTheme.colors.text}
              style={{ marginHorizontal: wp(6) }}
            />
            <AppIconButton
              icon={iconMap.callEnd}
              size={hp(4)}
              color={darkTheme.colors.text}
              onPress={() => {}}
              style={{ marginHorizontal: wp(6), width: 50, backgroundColor: 'red' }}
            />
          </View>
        </View>
      </AppMenuContainer>
      <AppVideoCallLocalView connected={false} minimized={false} />
      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: hp(30) + insets.top,
        }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <AppAvatarRenderer size={hp(16)} />
          <AppTextBody3 style={{ marginTop: hp(1), color: 'white' }}>Authorizing</AppTextBody3>
        </View>
      </View>
    </View>
  );
}
