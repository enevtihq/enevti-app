import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../../types/nft';
import AppNetworkImage from '../../../image/AppNetworkImage';
import { IPFStoURL } from '../../../../../service/ipfs';

interface NFTImageDataProps {
  nft: NFTBase;
}

export default React.memo(
  function NFTImageData({ nft }: NFTImageDataProps) {
    const styles = makeStyle();

    return (
      <View style={styles.imageContainer}>
        <AppNetworkImage
          url={IPFStoURL(nft.data)}
          style={styles.imageContainer}
        />
      </View>
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

const makeStyle = () =>
  StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  });
