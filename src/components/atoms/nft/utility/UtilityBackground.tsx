import { View, StyleSheet } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';

interface UtilityBackgroundProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function UtilityBackground({ nft, args }: UtilityBackgroundProps) {
    const styles = makeStyle(args);
    let source: any;

    switch (nft.utility) {
      case 'videocall':
        source = require('../../../../assets/nft-template/background/videocall.jpg');
        break;
      case 'chat':
        source = require('../../../../assets/nft-template/background/chat.jpg');
        break;
      case 'content':
        source = require('../../../../assets/nft-template/background/content.jpg');
        break;
      case 'gift':
        source = require('../../../../assets/nft-template/background/gift.jpg');
        break;
      case 'qr':
        source = require('../../../../assets/nft-template/background/qr.jpg');
        break;
      case 'stream':
        source = require('../../../../assets/nft-template/background/stream.jpg');
        break;
      default:
        source = undefined;
        break;
    }

    return (
      <View style={styles.utilityBackgroundContainer}>
        <FastImage
          source={source}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.utilityBackgroundContainer}
        />
      </View>
    );
  },
  (props, nextProps) => {
    if (
      props.nft.utility === nextProps.nft.utility &&
      props.args === nextProps.args
    ) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyle = (args: TemplateArgs) =>
  StyleSheet.create({
    utilityBackgroundContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      transform: [{ rotate: args.rotate }],
    },
  });
