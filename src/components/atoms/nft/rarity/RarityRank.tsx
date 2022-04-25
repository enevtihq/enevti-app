import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface RarityRankProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default function RarityRank({ nft, args, width }: RarityRankProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(args, theme), [args, theme]);
  const text = nft.NFTType === 'onekind' ? 'OneKind' : `Rank#${nft.rarity.stat.rank}`;

  const w = (parseFloat(args.width) * width) / 100.0;
  const h = (parseFloat(args.height) * width) / 100.0;
  const fontSize = Math.sqrt((w * h) / text.length);

  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[styles.rarityRankContainer, { fontSize: fontSize }]}>
      {text}
    </Text>
  );
}

const makeStyles = (args: TemplateArgs, theme: Theme) =>
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
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      color: 'black',
    },
  });
