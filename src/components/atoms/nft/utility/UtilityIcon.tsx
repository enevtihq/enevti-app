import { StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NFTBase } from 'enevti-types/chain/nft';
import { TemplateArgs } from 'enevti-types/chain/nft/NFTTemplate';
import utilityToIcon from 'enevti-app/utils/icon/utilityToIcon';

interface UtilityIconProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function UtilityIcon({ nft, args, width }: UtilityIconProps) {
    const styles = React.useMemo(() => makeStyles(args), [args]);

    const w = (parseFloat(args.width) * width) / 100.0;
    const iconSize = w * 0.75;
    const icon = utilityToIcon(nft.utility);

    return (
      <MaterialCommunityIcons name={icon} color={'black'} size={iconSize} style={styles.utilityBackgroundContainer} />
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

const makeStyles = (args: TemplateArgs) =>
  StyleSheet.create({
    utilityBackgroundContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      transform: [{ rotate: args.rotate }],
    },
  });
