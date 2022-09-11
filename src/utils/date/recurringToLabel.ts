import i18n from 'enevti-app/translations/i18n';
import { NFTRecurring } from 'enevti-app/types/core/chain/nft/NFTRedeem';

export default function recurringToLabel(recurring: NFTRecurring | '') {
  let text: string = '';

  switch (recurring) {
    case 'daily':
      text = i18n.t('createNFT:recurringEveryDay');
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
