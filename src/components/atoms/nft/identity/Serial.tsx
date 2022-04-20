import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface SerialProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function Serial({ nft, args, width }: SerialProps) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(args, theme), [args, theme]);
    const text = `${nft.symbol}#${nft.serial}`;

    const w = (parseFloat(args.width) * width) / 100.0;
    const h = (parseFloat(args.height) * width) / 100.0;
    const fontSize = Math.sqrt(((w * h) / (text.length + 10)) * 0.5);

    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.serialContainer, { fontSize: fontSize }]}>
        {text}
      </Text>
    );
  },
  (props, nextProps) => {
    if (
      props.nft.symbol === nextProps.nft.symbol &&
      props.nft.serial === nextProps.nft.serial &&
      props.args === nextProps.args
    ) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs, theme: Theme) =>
  StyleSheet.create({
    serialContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      justifyContent: 'center',
      paddingTop: `${parseFloat(args.height) * 0.75}%`,
      textAlign: 'center',
      transform: [{ rotate: args.rotate }],
      fontFamily: theme.fonts.medium.fontFamily,
      letterSpacing: Platform.OS === 'ios' ? -1 : -0.5,
      color: 'white',
    },
  });
