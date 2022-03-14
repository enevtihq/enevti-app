import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../../types/nft';
import AppNetworkImage from '../../../image/AppNetworkImage';
import { IPFStoURL } from '../../../../../service/ipfs';

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
        url={IPFStoURL(nft.data)}
        style={styles.imageContainer}
      />
    );
  },
  (props, nextProps) => {
    if (props.nft.data === nextProps.nft.data) {
      return true;
    } else {
      return false;
    }
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
