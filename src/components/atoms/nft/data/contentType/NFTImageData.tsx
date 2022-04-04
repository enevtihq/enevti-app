import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/nft';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import { shallowEqual } from 'react-redux';

interface NFTImageDataProps {
  nft: NFTBase;
  dataUri?: string;
}

export default React.memo(
  function NFTImageData({ nft, dataUri }: NFTImageDataProps) {
    const styles = React.useMemo(() => makeStyles(), []);

    return dataUri ? (
      <Image style={styles.imageContainer} source={{ uri: dataUri }} />
    ) : (
      <AppNetworkImage
        url={IPFStoURL(nft.data.cid)}
        style={styles.imageContainer}
      />
    );
  },
  (props, nextProps) => {
    return shallowEqual(props, nextProps);
  },
);

const makeStyles = () =>
  StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  });
