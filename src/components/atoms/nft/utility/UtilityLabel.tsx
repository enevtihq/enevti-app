import { StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TemplateArgs } from 'enevti-app/types/core/chain/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface UtilityLabelProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function UtilityLabel({ nft, args, width }: UtilityLabelProps) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(args, theme), [args, theme]);
    let text: string = 'help-circle-outline';

    switch (nft.utility) {
      case 'videocall':
        text = 'Video Call';
        break;
      case 'chat':
        text = 'Exclusive Chat';
        break;
      case 'content':
        text = 'Exclusive Content';
        break;
      case 'gift':
        text = 'Physical Gift';
        break;
      case 'qr':
        text = 'QR Code';
        break;
      case 'stream':
        text = 'Live Stream';
        break;
      default:
        break;
    }

    const w = (parseFloat(args.width) * width) / 100.0;
    const h = (parseFloat(args.height) * width) / 100.0;
    const fontSize = Math.sqrt((w * h) / (text.length + 20));

    return (
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.rarityRankContainer, { fontSize: fontSize }]}>
        {text}
      </Text>
    );
  },
  (props, nextProps) => {
    if (props.nft.utility === nextProps.nft.utility && props.args === nextProps.args) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs, theme: Theme) =>
  StyleSheet.create({
    rarityRankContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      justifyContent: 'center',
      paddingTop: `${parseFloat(args.height)}%`,
      position: 'absolute',
      transform: [{ rotate: args.rotate }],
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      color: 'white',
    },
  });
