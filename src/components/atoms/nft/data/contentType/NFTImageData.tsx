import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-types/chain/nft';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFSImagetoURL } from 'enevti-app/service/ipfs';
import { shallowEqual } from 'react-redux';
import { SizeCode } from 'enevti-types/service/api';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';

interface NFTImageDataProps {
  nft: NFTBase;
  imageSize: SizeCode;
  lazy?: boolean;
  dataUri?: string;
  blurRadius?: number;
  realRatio?: boolean;
  width?: number;
}

export default React.memo(
  function NFTImageData({ nft, imageSize, lazy, dataUri, blurRadius, realRatio, width }: NFTImageDataProps) {
    const theme = useTheme() as Theme;
    const [aspectRatio, setAspectRatio] = React.useState<number>();
    const styles = React.useMemo(() => makeStyles(aspectRatio, realRatio), [aspectRatio, realRatio]);

    const onLoad = React.useCallback(
      (w: number, h: number) => {
        if (realRatio) {
          setAspectRatio(w / h);
        }
      },
      [realRatio],
    );

    return dataUri ? (
      <Image
        onLoad={t => onLoad(t.nativeEvent.source.width, t.nativeEvent.source.height)}
        style={styles.imageContainer}
        source={{ uri: dataUri }}
        blurRadius={blurRadius}
      />
    ) : (
      <AppNetworkImage
        errorComponent={
          <AppIconComponent
            name={iconMap.error}
            size={width ? width / 4 : 30}
            color={theme.colors.placeholder}
            style={[styles.imageContainer, styles.errorContainer]}
          />
        }
        thumb={lazy ? IPFSImagetoURL(nft.data.cid, 'xxs') : undefined}
        onLoad={onLoad}
        url={IPFSImagetoURL(nft.data.cid, imageSize)}
        fallbackUrl={IPFSImagetoURL(nft.data.cid, 'og')}
        style={styles.imageContainer}
      />
    );
  },
  (props, nextProps) => {
    return shallowEqual(props, nextProps);
  },
);

const makeStyles = (aspectRatio?: number, realRatio?: boolean) =>
  StyleSheet.create({
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      position: 'absolute',
      width: !realRatio ? '100%' : aspectRatio ? (aspectRatio >= 1 ? '100%' : undefined) : '100%',
      height: !realRatio ? '100%' : aspectRatio ? (aspectRatio >= 1 ? undefined : '100%') : '100%',
      aspectRatio,
      backgroundColor: 'transparent',
      opacity: realRatio ? (aspectRatio !== undefined ? 1 : 0) : 1,
    },
  });
