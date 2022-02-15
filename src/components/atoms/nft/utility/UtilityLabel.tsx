import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface UtilityLabelProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function UtilityLabel({ nft, args }: UtilityLabelProps) {
    const theme = useTheme();
    const styles = makeStyle(args, theme);
    let text: string = 'help-circle-outline';

    switch (nft.utility) {
      case 'videocall':
        text = 'Video Call';
        break;
      case 'chat':
        text = 'Direct Chat';
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
      <View onLayout={onLayout} style={styles.rarityRankContainer}>
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
      props.nft.utility === nextProps.nft.utility &&
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
      justifyContent: 'center',
      position: 'absolute',
      transform: [{ rotate: args.rotate }],
    },
    text: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '500' : '700',
      color: 'white',
    },
  });
