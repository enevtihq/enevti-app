import { View, StyleSheet } from 'react-native';
import React from 'react';
import { NFT } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import FastImage from 'react-native-fast-image';

interface RarityIconProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function RarityIcon({ nft, args }: RarityIconProps) {
  const styles = makeStyle(args, nft);

  return (
    <View style={styles.rarityIconContainer}>
      <FastImage
        source={require('../../../../assets/images/enevti-icon-gs.png')}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.image}
      />
      <FastImage
        source={require('../../../../assets/images/enevti-icon.png')}
        resizeMode={FastImage.resizeMode.contain}
        style={[styles.image]}
      />
    </View>
  );
}

const makeStyle = (args: TemplateArgs, nft: NFT) =>
  StyleSheet.create({
    rarityIconContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
    },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      opacity:
        nft.NFTType === 'one-kind' ? 1 : 1 - nft.rarity.stat.percent / 100,
    },
  });
