import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import color from 'color';

interface RarityPercentProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default function RarityPercent({
  nft,
  args,
  width,
}: RarityPercentProps) {
  const theme = useTheme();
  const styles = makeStyle(args, theme);
  const text =
    nft.NFTType === 'one-kind'
      ? '☆☆☆'
      : `${(nft.rarity.stat.percent / 100).toString()}%`;

  const w = (parseFloat(args.width) * width) / 100.0;
  const h = (parseFloat(args.height) * width) / 100.0;
  const fontSize = Math.sqrt((w * h) / text.length) / 2;

  return (
    <Text
      numberOfLines={1}
      style={[styles.rarityPercentContainer, { fontSize: fontSize }]}>
      {text}
    </Text>
  );
}

const makeStyle = (args: TemplateArgs, theme: Theme) =>
  StyleSheet.create({
    rarityPercentContainer: {
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
      color: color('black').alpha(0.5).rgb().toString(),
    },
  });
