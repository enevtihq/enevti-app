import { View, StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NFT } from '../../../types/nft';
import { TemplateArgs } from '../../../types/nft/NFTTemplate';
import { iconMap } from '../icon/AppIconComponent';

interface UtilityIconProps {
  nft: NFT;
  args: TemplateArgs;
}

export default function UtilityIcon({ nft, args }: UtilityIconProps) {
  const styles = makeStyle(args);

  const [iconSize, setIconSize] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setIconSize(e.nativeEvent.layout.width * 0.75);
  }, []);

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
