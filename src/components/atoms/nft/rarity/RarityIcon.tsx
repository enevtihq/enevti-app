import { StyleSheet } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-types/chain/nft';
import { TemplateArgs } from 'enevti-types/chain/nft/NFTTemplate';
import FastImage from 'react-native-fast-image';

interface RarityIconProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function RarityIcon({ nft, args }: RarityIconProps) {
    const styles = React.useMemo(() => makeStyles(args), [args]);
    const source =
      nft.nftType !== 'onekind'
        ? nft.rarity.stat.percent < 50
          ? require('enevti-app/assets/images/enevti-icon.png')
          : require('enevti-app/assets/images/enevti-icon-gs.png')
        : require('enevti-app/assets/images/enevti-icon.png');

    return <FastImage source={source} resizeMode={FastImage.resizeMode.contain} style={styles.rarityIconContainer} />;
  },
  (props, nextProps) => {
    if (props.nft.rarity.stat.percent > 50 && nextProps.nft.rarity.stat.percent > 50 && props.args === nextProps.args) {
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
