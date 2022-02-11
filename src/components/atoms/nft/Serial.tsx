import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFT } from '../../../types/nft';
import { TemplateArgs } from '../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface SerialProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function Serial({ nft, args }: SerialProps) {
  const theme = useTheme();
  const styles = makeStyle(args, theme);
  const text = `Serial No. #${nft.serial}`;

  const [fontSize, setFontSize] = React.useState<number>(0);
  const onLayout = React.useCallback(
    e => {
      setFontSize(
        Math.sqrt(
          (e.nativeEvent.layout.width * e.nativeEvent.layout.height) /
            (text.length + 10),
        ),
      );
    },
    [text.length],
  );

  return (
    <View onLayout={onLayout} style={styles.serialContainer}>
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
    serialContainer: {
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
      textAlign: 'center',
      letterSpacing: Platform.OS === 'ios' ? -1 : -0.5,
      color: 'white',
    },
  });
