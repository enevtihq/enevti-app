import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { NFTUtility } from 'enevti-app/types/core/chain/nft/NFTUtility';

export default function utilityToIcon(utility: NFTUtility) {
  let icon: string = 'help-circle-outline';

  switch (utility) {
    case 'videocall':
      icon = iconMap.utilityVideoCall;
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
    default:
      break;
  }

  return icon;
}
