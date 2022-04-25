import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';
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
    const styles = React.useMemo(() => makeStyles(args, theme), [args, theme]);
    let text: string = 'Unknown';

    if (nft.NFTType === 'onekind') {
      text = 'One Kind';
    } else if (nft.NFTType === 'packed' && nft.partition.parts.length > 0) {
      text = `${nft.partition.parts.length.toString()} Parts`;
    } else if (nft.NFTType === 'upgradable') {
      text = `Combine ${nft.partition.upgradeMaterial.toString()}`;
    }

    const w = (parseFloat(args.width) * width) / 100.0;
    const h = (parseFloat(args.height) * width) / 100.0;
    const fontSize = Math.sqrt((w * h) / (text.length + 10));

    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.partitionLabel, { fontSize: fontSize }]}>
        {text}
      </Text>
    );
  },
  (props, nextProps) => {
    if (props.nft.NFTType === nextProps.nft.NFTType && props.args === nextProps.args) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs, theme: Theme) =>
  StyleSheet.create({
    partitionLabel: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      justifyContent: 'center',
      paddingTop: `${parseFloat(args.height) * 2}%`,
      textAlign: 'center',
      transform: [{ rotate: args.rotate }],
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      color: 'white',
    },
  });
