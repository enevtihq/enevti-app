import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface RarityRankProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default function RarityRank({ nft, args, width }: RarityRankProps) {
  const theme = useTheme();
  const styles = makeStyle(args, theme);
  const text =
    nft.NFTType === 'one-kind' ? 'OneKind' : `Rank#${nft.rarity.stat.rank}`;

  const w = (parseFloat(args.width) * width) / 100.0;
  const h = (parseFloat(args.height) * width) / 100.0;
  const fontSize = Math.sqrt((w * h) / text.length);

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
}

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
      color: 'black',
    },
  });
