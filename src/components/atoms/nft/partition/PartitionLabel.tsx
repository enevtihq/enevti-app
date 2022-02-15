import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface PartitionLabelProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function PartitionLabel({ nft, args, width }: PartitionLabelProps) {
    const theme = useTheme();
    const styles = makeStyle(args, theme);
    let text: string = '';

    if (nft.NFTType === 'one-kind') {
      text = 'One Kind';
    } else if (nft.NFTType === 'packed' && nft.redeem.parts.length > 0) {
      text = `${nft.redeem.parts.length.toString()} Parts`;
    } else if (nft.NFTType === 'upgradable') {
      text = `Combine ${nft.redeem.upgradeMaterial.toString()}`;
    }

    const w = (parseFloat(args.width) * width) / 100.0;
    const h = (parseFloat(args.height) * width) / 100.0;
    const fontSize = Math.sqrt((w * h) / (text.length + 10));

    return (
      <View style={styles.rarityRankContainer}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.text, { fontSize: fontSize }]}>
          {text}
        </Text>
      </View>
    );
  },
  (props, nextProps) => {
    if (
      props.nft.NFTType === nextProps.nft.NFTType &&
      props.args === nextProps.args
    ) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyle = (args: TemplateArgs, theme: Theme) =>
  StyleSheet.create({
    rarityRankContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      transform: [{ rotate: args.rotate }],
    },
    text: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      textAlign: 'center',
      color: 'white',
    },
  });
