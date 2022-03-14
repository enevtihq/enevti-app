import { StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { iconMap } from '../../icon/AppIconComponent';

interface PartitionIconProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function PartitionIcon({ nft, args, width }: PartitionIconProps) {
    const styles = makeStyles(args);

    const w = (parseFloat(args.width) * width) / 100.0;
    const iconSize = w * 0.75;

    let icon: string = 'help-circle-outline';

    if (nft.NFTType === 'onekind') {
      icon = iconMap.nftOneKind;
    } else if (nft.NFTType === 'pack' && nft.redeem.parts.length > 0) {
      icon = iconMap.nftPartitioned;
    } else if (nft.NFTType === 'upgradable') {
      icon = iconMap.nftUpgradable;
    }

    return (
      <MaterialCommunityIcons
        name={icon}
        color={'black'}
        size={iconSize}
        style={styles.utilityBackgroundContainer}
      />
    );
  },
  (props, nextProps) => {
    if (
      props.nft.NFTType === nextProps.nft.NFTType &&
      props.args === nextProps.args
    ) {
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
