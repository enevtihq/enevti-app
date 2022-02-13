import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NFT } from '../../../../../types/nft';
import AppNetworkImage from '../../../image/AppNetworkImage';
import { IPFStoURL } from '../../../../../service/ipfs';

interface NFTImageDataProps {
  nft: NFT;
}

export default function NFTImageData({ nft }: NFTImageDataProps) {
  const styles = makeStyle();

  return (
    <View style={styles.imageContainer}>
      <AppNetworkImage
        url={IPFStoURL(nft.data)}
        style={styles.imageContainer}
      />
    </View>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  });
