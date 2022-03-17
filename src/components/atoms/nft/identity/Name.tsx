import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface NameProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function Name({ nft, args, width }: NameProps) {
    const theme = useTheme();
    const styles = makeStyles(args, theme);
    const text = nft.name;

    const w = (parseFloat(args.width) * width) / 100.0;
    const h = (parseFloat(args.height) * width) / 100.0;
    const fontSize = Math.sqrt((w * h) / Math.max(text.length, 12));

    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.nameContainer, { fontSize: fontSize }]}>
        {text}
      </Text>
    );
  },
  (props, nextProps) => {
    if (
      props.nft.name === nextProps.nft.name &&
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
    nameContainer: {
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
      fontWeight: Platform.OS === 'ios' ? '700' : '700',
      letterSpacing: Platform.OS === 'ios' ? -1 : 0,
      color: 'white',
    },
  });
