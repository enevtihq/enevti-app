import i18n from 'enevti-app/translations/i18n';
import { NFT } from 'enevti-app/types/core/chain/nft';

export default function recurringToLabel(
  recurring: NFT['redeem']['schedule']['recurring'],
) {
  let text: string = '';

  switch (recurring) {
    case 'daily':
      text = i18n.t('create:recurringEveryDay');
      break;
    case 'weekly':
      text = i18n.t('createNFT:recurringEveryWeek');
      break;
    case 'monthly':
      text = i18n.t('createNFT:recurringEveryMonth');
      break;
    case 'yearly':
      text = i18n.t('createNFT:recurringEveryYear');
      break;
    case 'once':
      text = i18n.t('createNFT:recurringOnce');
      break;
    default:
      text = i18n.t('error:unknown');
      break;
  }

  return text;
}
