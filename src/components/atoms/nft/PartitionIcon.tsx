import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import { TemplateArgs } from '../../../types/nft/NFTTemplate';

interface PartitionIconProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function PartitionIcon({ nft, args }: PartitionIconProps) {
  const styles = makeStyle(args);
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

const makeStyle = (args: TemplateArgs) =>
  StyleSheet.create({
    utilityBackgroundContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
    },
  });
