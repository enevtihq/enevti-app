import { StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import ImageBlurLoading from 'react-native-image-blur-loading';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FI, { ImageStyle, ResizeMode } from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';

import { Theme } from 'enevti-app/theme/default';
import AppIconComponent, { iconMap } from '../icon/AppIconComponent';

const FastImage = createImageProgress(FI);

interface AppNetworkImageProps {
  url: string;
  fallbackUrl?: string;
  errorComponent?: JSX.Element;
  thumb?: string;
  style?: StyleProp<ImageStyle>;
  loaderSize?: number;
  onLoad?: (width: number, height: number) => void;
  onError?: () => void;
  resizeMode?: ResizeMode;
}

export default function AppNetworkImage({
  url,
  fallbackUrl,
  errorComponent,
  thumb,
  style,
  onLoad,
  onError,
  loaderSize = 30,
  resizeMode = 'cover',
}: AppNetworkImageProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);
  const [fallbackError, setFallbackError] = React.useState<boolean>(false);
  const [showErrorComponent, setShowErrorComponent] = React.useState<boolean>(false);

  const onFallbackError = React.useCallback(() => {
    if (fallbackUrl) {
      setFallbackError(true);
    } else {
      setShowErrorComponent(true);
    }
  }, [fallbackUrl]);

  const onShowError = React.useCallback(() => {
    setShowErrorComponent(true);
    onError && onError();
  }, [onError]);

  return showErrorComponent ? (
    errorComponent ? (
      errorComponent
    ) : (
      <AppIconComponent
        name={iconMap.error}
        size={30}
        color={theme.colors.placeholder}
        style={[styles.errorComponent, style]}
      />
    )
  ) : fallbackError ? (
    <AppFastImage
      url={fallbackUrl!}
      resizeMode={resizeMode}
      style={style}
      onLoad={onLoad}
      onError={onShowError}
      loaderSize={loaderSize}
    />
  ) : (
    <AppFastImage
      url={url}
      thumb={thumb}
      style={style}
      onLoad={onLoad}
      onError={onFallbackError}
      loaderSize={loaderSize}
      resizeMode={resizeMode}
    />
  );
}

function AppFastImage({
  url,
  thumb,
  style,
  onLoad,
  onError,
  loaderSize = 30,
  resizeMode = 'cover',
}: AppNetworkImageProps) {
  const theme = useTheme() as Theme;

  return thumb ? (
    <ImageBlurLoading
      withIndicator
      fastImage
      resizeMode={resizeMode}
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
      resizeMode={resizeMode}
      indicator={Progress.Circle}
      indicatorProps={{
        color: theme.colors.text,
        size: loaderSize,
      }}
    />
  );
}

const makeStyles = () =>
  StyleSheet.create({
    errorComponent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
