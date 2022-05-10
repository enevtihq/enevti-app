import { StyleSheet } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';

interface UtilityBackgroundProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function UtilityBackground({ nft, args }: UtilityBackgroundProps) {
    const styles = React.useMemo(() => makeStyles(args), [args]);
    let source: any;

    switch (nft.utility) {
      case 'videocall':
        source = require('enevti-app/assets/nft-template/background/videocall.jpg');
        break;
      case 'chat':
        source = require('enevti-app/assets/nft-template/background/chat.jpg');
        break;
      case 'content':
        source = require('enevti-app/assets/nft-template/background/content.jpg');
        break;
      case 'gift':
        source = require('enevti-app/assets/nft-template/background/gift.jpg');
        break;
      case 'qr':
        source = require('enevti-app/assets/nft-template/background/qr.jpg');
        break;
      case 'stream':
        source = require('enevti-app/assets/nft-template/background/stream.jpg');
        break;
      default:
        source = undefined;
        break;
    }

    return (
      <FastImage source={source} resizeMode={FastImage.resizeMode.cover} style={styles.utilityBackgroundContainer} />
    );
  },
  (props, nextProps) => {
    if (props.nft.utility === nextProps.nft.utility && props.args === nextProps.args) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs) =>
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
