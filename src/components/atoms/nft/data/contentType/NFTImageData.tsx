import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { shallowEqual } from 'react-redux';

interface NFTImageDataProps {
  nft: NFTBase;
  dataUri?: string;
  blurRadius?: number;
  realRatio?: boolean;
}

export default React.memo(
  function NFTImageData({ nft, dataUri, blurRadius, realRatio }: NFTImageDataProps) {
    const [aspectRatio, setAspectRatio] = React.useState<number>();
    const styles = React.useMemo(() => makeStyles(aspectRatio, realRatio), [aspectRatio, realRatio]);

    const onLoad = React.useCallback(
      (width: number, height: number) => {
        if (realRatio) {
          setAspectRatio(width / height);
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
      <AppNetworkImage onLoad={onLoad} url={IPFStoURL(nft.data.cid)} style={styles.imageContainer} />
    );
  },
  (props, nextProps) => {
    return shallowEqual(props, nextProps);
  },
);

const makeStyles = (aspectRatio?: number, realRatio?: boolean) =>
  StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      width: !realRatio ? '100%' : aspectRatio ? (aspectRatio >= 1 ? '100%' : undefined) : '100%',
      height: !realRatio ? '100%' : aspectRatio ? (aspectRatio >= 1 ? undefined : '100%') : '100%',
      aspectRatio,
      backgroundColor: 'transparent',
      opacity: realRatio ? (aspectRatio !== undefined ? 1 : 0) : 1,
    },
  });
