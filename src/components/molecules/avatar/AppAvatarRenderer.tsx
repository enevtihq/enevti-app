import { StyleProp, StyleSheet, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageStyle } from 'react-native-fast-image';

import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import Avatar from 'enevti-app/components/atoms/avatar';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

import { useTheme } from 'react-native-paper';
import { Persona } from 'enevti-types/account/persona';

interface AppAvatarRendererProps {
  size: number;
  full?: boolean;
  persona?: Persona;
  base32?: string;
  photo?: string;
  style?: StyleProp<ImageStyle>;
  color?: string;
}

export default function AppAvatarRenderer({
  size,
  persona,
  full,
  photo,
  base32,
  style,
  color,
}: AppAvatarRendererProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(size, color, full), [size, color, full]);

  const mode = React.useMemo(
    () =>
      (persona && persona.photo) || photo ? 'photo' : (persona && persona.base32) || base32 ? 'base32' : undefined,
    [base32, photo, persona],
  );

  const value = React.useMemo(
    () =>
      mode === 'photo'
        ? persona && persona.photo
          ? persona.photo
          : photo
          ? photo
          : undefined
        : mode === 'base32'
        ? persona && persona.base32
          ? persona.base32
          : base32
          ? base32
          : undefined
        : undefined,
    [base32, photo, persona, mode],
  );

  return (
    <View style={[styles.container, style]}>
      {mode === 'photo' && value ? (
        <AppNetworkImage style={styles.image} url={IPFStoURL(value)} />
      ) : mode === 'base32' && value ? (
        <Avatar address={value} />
      ) : (
        <MaterialCommunityIcons
          name={iconMap.accountCircle}
          color={color ? color : theme.colors.text}
          size={size * 0.9}
          style={styles.icon}
        />
      )}
    </View>
  );
}

const makeStyles = (size: number, color?: string, full?: boolean) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      width: size,
      aspectRatio: 1,
      borderRadius: full ? undefined : size / 2,
      borderColor: color,
      borderWidth: color ? size / 30 : undefined,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    icon: {
      textAlign: 'center',
    },
  });
