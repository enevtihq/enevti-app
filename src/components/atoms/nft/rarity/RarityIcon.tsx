import { StyleSheet } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import FastImage from 'react-native-fast-image';

interface RarityIconProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function RarityIcon({ nft, args }: RarityIconProps) {
    const styles = makeStyles(args);
    const source =
      nft.NFTType !== 'onekind'
        ? nft.rarity.stat.percent < 50
          ? require('../../../../assets/images/enevti-icon.png')
          : require('../../../../assets/images/enevti-icon-gs.png')
        : require('../../../../assets/images/enevti-icon.png');

    return (
      <FastImage
        source={source}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.rarityIconContainer}
      />
    );
  },
  (props, nextProps) => {
    if (
      props.nft.rarity.stat.percent > 50 &&
      nextProps.nft.rarity.stat.percent > 50 &&
      props.args === nextProps.args
    ) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs) =>
  StyleSheet.create({
    rarityIconContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
    },
  });
