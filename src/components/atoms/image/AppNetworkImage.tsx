import { StyleProp } from 'react-native';
import React from 'react';
import ImageBlurLoading from 'react-native-image-blur-loading';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FI, { ImageStyle } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';

import { Theme } from 'enevti-app/theme/default';

const FastImage = createImageProgress(FI);

interface AppNetworkImageProps {
  url: string;
  thumb?: string;
  style?: StyleProp<ImageStyle>;
  loaderSize?: number;
  onLoad?: (width: number, height: number) => void;
  onError?: () => void;
}

export default function AppNetworkImage({ url, thumb, style, onLoad, onError, loaderSize = 30 }: AppNetworkImageProps) {
  const theme = useTheme() as Theme;

  return thumb ? (
    <ImageBlurLoading
      withIndicator
      fastImage
      onLayout={e => onLoad && onLoad(e.nativeEvent.layout.width, e.nativeEvent.layout.height)}
      onError={onError}
      thumbnailSource={{ uri: thumb }}
      source={{ uri: url }}
      style={style}
    />
  ) : (
    <FastImage
      onLoad={t => onLoad && onLoad(t.nativeEvent.width, t.nativeEvent.height)}
      onError={onError}
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
