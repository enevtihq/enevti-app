import { StyleProp, StyleSheet, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageStyle } from 'react-native-fast-image';

import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import Avatar from 'enevti-app/components/atoms/avatar';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

import { useTheme } from 'react-native-paper';
import { Persona } from 'enevti-app/types/core/account/persona';

interface AppAvatarRendererProps {
  size: number;
  persona: Persona;
  style?: StyleProp<ImageStyle>;
  color?: string;
}

export default function AppAvatarRenderer({
  size,
  persona,
  style,
  color,
}: AppAvatarRendererProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(size, color), [size, color]);

  return (
    <View style={[styles.container, style]}>
      {persona.photo ? (
        <AppNetworkImage style={styles.image} url={IPFStoURL(persona.photo)} />
      ) : persona.base32 ? (
        <Avatar address={persona.base32} />
      ) : (
        <MaterialCommunityIcons
          name={iconMap.accountCircle}
          color={color ? color : theme.colors.text}
          size={size * 0.9}
        />
      )}
    </View>
  );
}

const makeStyles = (size: number, color?: string) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      width: size,
      aspectRatio: 1,
      borderRadius: size / 2,
      borderColor: color,
      borderWidth: color ? size / 30 : undefined,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
