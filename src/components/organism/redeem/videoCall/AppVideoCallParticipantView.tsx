import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TwilioVideoParticipantView } from 'react-native-twilio-video-webrtc';
import { Persona } from 'enevti-app/types/core/account/persona';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import darkTheme from 'enevti-app/theme/dark';
import Color from 'color';

interface AppVideoCallParticipantViewProps {
  participantSid: string;
  trackSid: string;
  persona?: Persona;
  micOff?: boolean;
  videoOff?: boolean;
}

export default function AppVideoCallParticipantView({
  participantSid,
  trackSid,
  persona,
  micOff,
  videoOff,
}: AppVideoCallParticipantViewProps) {
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <View style={styles.participantVideo}>
      {videoOff ? (
        <View style={styles.avatar}>
          <AppAvatarRenderer persona={persona} size={hp(14)} />
        </View>
      ) : (
        <TwilioVideoParticipantView
          style={styles.participantVideo}
          key={trackSid}
          trackIdentifier={{ participantSid, videoTrackSid: trackSid }}
        />
      )}
      {micOff ? (
        <View style={styles.micOff}>
          <AppIconComponent name={iconMap.micOff} size={hp(3)} color={darkTheme.colors.text} />
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    participantVideo: {
      flex: 1,
    },
    avatar: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    micOff: {
      position: 'absolute',
      width: wp(10),
      height: wp(10),
      top: wp(15),
      right: wp(5),
      backgroundColor: Color(darkTheme.colors.placeholder).alpha(0.3).rgb().toString(),
      padding: wp(1.75),
      borderRadius: wp(10),
    },
  });
