import i18n from 'enevti-app/translations/i18n';
import { NFTUtility } from 'enevti-types/chain/nft/NFTUtility';

export default function utilityToLabel(utility: NFTUtility) {
  let text: string = '';

  switch (utility) {
    case 'videocall':
      text = i18n.t('createNFT:utilityVideoCall');
      break;
    case 'content':
      text = i18n.t('createNFT:utilityContent');
      break;
    case 'gift':
      text = i18n.t('createNFT:utilityGift');
      break;
    case 'qr':
      text = i18n.t('createNFT:utilityQR');
      break;
    default:
      text = i18n.t('error:unknown');
      break;
  }

  return text;
}
