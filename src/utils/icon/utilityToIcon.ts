import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

export default function utilityToIcon(utility: string) {
  let icon: string = 'help-circle-outline';

  switch (utility) {
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

  return icon;
}
