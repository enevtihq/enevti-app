import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';

interface UtilityBackgroundProps {
  nft: NFT;
  width: number;
}

export default function UtilityBackground({
  nft,
  width,
}: UtilityBackgroundProps) {
  const styles = makeStyle(width);
  let source: any;

  switch (nft.utility) {
    case 'videocall':
      source = require('../../../assets/nft-template/background/videocall.jpg');
      break;
    case 'chat':
      source = require('../../../assets/nft-template/background/chat.jpg');
      break;
    case 'content':
      source = require('../../../assets/nft-template/background/content.jpg');
      break;
    case 'gift':
      source = require('../../../assets/nft-template/background/gift.jpg');
      break;
    case 'qr':
      source = require('../../../assets/nft-template/background/qr.jpg');
      break;
    case 'stream':
      source = require('../../../assets/nft-template/background/stream.jpg');
      break;
    default:
      source = undefined;
      break;
  }

  return (
    <View style={styles.utilityBackgroundContainer}>
      <Image
        source={source}
        resizeMode={'cover'}
        style={styles.utilityBackgroundContainer}
      />
    </View>
  );
}

const makeStyle = (width: number) =>
  StyleSheet.create({
    utilityBackgroundContainer: {
      width: width,
      height: width,
      position: 'absolute',
    },
  });
