import { View, StyleSheet } from 'react-native';
import React from 'react';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';

interface BoxProps {
  args: TemplateArgs;
}

export default React.memo(
  function Box({ args }: BoxProps) {
    const styles = React.useMemo(() => makeStyles(args), [args]);

    return <View style={styles.boxContainer} />;
  },
  (props, nextProps) => {
    if (props.args === nextProps.args) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyles = (args: TemplateArgs) =>
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
