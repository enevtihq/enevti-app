import { iconMap, UNDEFINED_ICON } from 'enevti-app/components/atoms/icon/AppIconComponent';

const iconMappings = {
  mint: iconMap.mint,
  created: iconMap.newBox,
  redeem: iconMap.redeem,
  secretDelivered: iconMap.secretDelivered,
  addStake: iconMap.addStake,
  registerUsername: iconMap.username,
  selfStake: iconMap.stake,
  tokenSent: iconMap.transfer,
  tokenReceived: iconMap.receive,
  createNFT: iconMap.createNFT,
  mintNFT: iconMap.mint,
  NFTSale: iconMap.buy,
  deliverSecret: iconMap.secretDelivered,
};

export default function activityToIcon(activity: string) {
  return activity in iconMappings ? (iconMappings as any)[activity] : UNDEFINED_ICON;
}
