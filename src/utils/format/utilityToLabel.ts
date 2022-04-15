import i18n from 'enevti-app/translations/i18n';

export default function utilityToLabel(utility: string) {
  let text: string = '';

  switch (utility) {
    case 'videocall':
      text = i18n.t('createNFT:utilityVideoCall');
      break;
    case 'chat':
      text = i18n.t('createNFT:utilityChat');
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
    case 'stream':
      text = i18n.t('createNFT:utilityStream');
      break;
    default:
      text = i18n.t('error:unknown');
      break;
  }

  return text;
}
