import { View, StyleSheet } from 'react-native';
import React from 'react';
import { TemplateArgs } from '../../../types/nft/NFTTemplate';

interface BoxProps {
  args: TemplateArgs;
}

export default function Box({ args }: BoxProps) {
  const styles = makeStyle(args);

  return <View style={styles.boxContainer} />;
}

const makeStyle = (args: TemplateArgs) =>
  StyleSheet.create({
    boxContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      backgroundColor: 'white',
      transform: [{ rotate: args.rotate }],
    },
  });
