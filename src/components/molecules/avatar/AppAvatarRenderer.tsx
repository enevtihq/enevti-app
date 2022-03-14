import { StyleProp, StyleSheet, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageStyle } from 'react-native-fast-image';

import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../../service/ipfs';
import Avatar from '../../atoms/avatar';
import { iconMap } from '../../atoms/icon/AppIconComponent';

import { useTheme } from 'react-native-paper';

interface AppAvatarRendererProps {
  size: number;
  photo?: string;
  address?: string;
  style?: StyleProp<ImageStyle>;
  color?: string;
}

export default function AppAvatarRenderer({
  size,
  photo,
  address,
  style,
  color,
}: AppAvatarRendererProps) {
  const theme = useTheme();
  const styles = makeStyles(size, color);

  return (
    <View style={[styles.container, style]}>
      {photo ? (
        <AppNetworkImage style={styles.image} url={IPFStoURL(photo)} />
      ) : address ? (
        <Avatar address={address} />
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
