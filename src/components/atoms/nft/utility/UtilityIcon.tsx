import { StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NFTBase } from '../../../../types/nft';
import { TemplateArgs } from '../../../../types/nft/NFTTemplate';
import { iconMap } from '../../icon/AppIconComponent';

interface UtilityIconProps {
  nft: NFTBase;
  args: TemplateArgs;
  width: number;
}

export default React.memo(
  function UtilityIcon({ nft, args, width }: UtilityIconProps) {
    const styles = makeStyle(args);

    const w = (parseFloat(args.width) * width) / 100.0;
    const iconSize = w * 0.75;

    let icon: string = 'help-circle-outline';

    switch (nft.utility) {
      case 'videocall':
        icon = iconMap.utilityVideoCall;
        break;
      case 'chat':
        icon = iconMap.utilityChat;
        break;
      case 'content':
        icon = iconMap.utilityContent;
        break;
      case 'gift':
        icon = iconMap.utilityGift;
        break;
      case 'qr':
        icon = iconMap.utilityQR;
        break;
      case 'stream':
        icon = iconMap.utilityStream;
        break;
      default:
        break;
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
      props.nft.utility === nextProps.nft.utility &&
      props.args === nextProps.args
    ) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyle = (args: TemplateArgs) =>
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
