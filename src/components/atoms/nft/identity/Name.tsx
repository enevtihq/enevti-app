import { View, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface NameProps {
  nft: NFTBase;
  args: TemplateArgs;
}

export default React.memo(
  function Name({ nft, args }: NameProps) {
    const theme = useTheme();
    const styles = makeStyle(args, theme);
    const text = nft.name;

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
      <View onLayout={onLayout} style={styles.nameContainer}>
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
      props.nft.name === nextProps.nft.name &&
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
    },
    text: {
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: Platform.OS === 'ios' ? '700' : '700',
      textAlign: 'center',
      letterSpacing: Platform.OS === 'ios' ? -1 : 0,
      color: 'white',
    },
  });
