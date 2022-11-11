import { StyleProp } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FI, { ImageStyle } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';

import { Theme } from 'enevti-app/theme/default';

const FastImage = createImageProgress(FI);

interface AppNetworkImageProps {
  url: string;
  style?: StyleProp<ImageStyle>;
  loaderSize?: number;
}

export default function AppNetworkImage({ url, style, loaderSize = 30 }: AppNetworkImageProps) {
  const theme = useTheme() as Theme;

  return (
    <FastImage
      style={style}
      source={{
        uri: url,
        priority: FI.priority.high,
      }}
      resizeMode={FI.resizeMode.cover}
      indicator={Progress.Circle}
      indicatorProps={{
        color: theme.colors.text,
        size: loaderSize,
      }}
    />
  );
}
