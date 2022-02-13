import { View, StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NFT } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { iconMap } from '../../icon/AppIconComponent';

interface PartitionIconProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function PartitionIcon({ nft, args }: PartitionIconProps) {
  const styles = makeStyle(args);

  const [iconSize, setIconSize] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setIconSize(e.nativeEvent.layout.width * 0.75);
  }, []);

  let icon: string = 'help-circle-outline';

  if (nft.NFTType === 'one-kind') {
    icon = iconMap.nftOneKind;
  } else if (nft.NFTType === 'packed' && nft.redeem.parts.length > 0) {
    icon = iconMap.nftPartitioned;
  } else if (nft.NFTType === 'upgradable') {
    icon = iconMap.nftUpgradable;
  }

  return (
    <View onLayout={onLayout} style={styles.utilityBackgroundContainer}>
      <MaterialCommunityIcons name={icon} color={'black'} size={iconSize} />
    </View>
  );
}

const makeStyle = (args: TemplateArgs) =>
  StyleSheet.create({
    utilityBackgroundContainer: {
      width: args.width,
      height: args.height,
      top: args.y,
      left: args.x,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: args.rotate }],
    },
  });
