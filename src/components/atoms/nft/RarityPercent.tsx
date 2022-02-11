import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import { TemplateArgs } from '../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import color from 'color';

interface RarityPercentProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function RarityPercent({ nft, args }: RarityPercentProps) {
  const theme = useTheme();
  const styles = makeStyle(args, theme);
  const text =
    nft.NFTType === 'one-kind'
      ? '☆☆☆'
      : `${(nft.rarity.stat.percent / 100).toString()}%`;

  const [fontSize, setFontSize] = React.useState<number>(0);
  const onLayout = React.useCallback(
    e => {
      setFontSize(
        Math.sqrt(
          (e.nativeEvent.layout.width * e.nativeEvent.layout.height) /
            text.length,
        ),
      );
    },
    [text.length],
  );

  return (
    <View onLayout={onLayout} style={styles.rarityPercentContainer}>
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
    rarityPercentContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    text: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      textAlign: 'center',
      color: color('black').alpha(0.5).rgb().toString(),
    },
  });
