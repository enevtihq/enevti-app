import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import { TemplateArgs } from '../../../types/nft/template';

interface RarityIconProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function RarityIcon({ nft, args }: RarityIconProps) {
  const styles = makeStyle(args);

  return (
    <View style={styles.rarityIconContainer}>
      <Image
        source={require('../../../assets/images/enevti-icon-gs.png')}
        resizeMode={'contain'}
        style={styles.image}
      />
      <Image
        source={require('../../../assets/images/enevti-icon.png')}
        resizeMode={'contain'}
        style={[styles.image, { opacity: 1 - nft.rarity.stat.percent / 100 }]}
      />
    </View>
  );
}

const makeStyle = (args: TemplateArgs) =>
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
    },
  });
