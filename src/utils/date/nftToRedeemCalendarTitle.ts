import { NFT } from 'enevti-app/types/core/chain/nft';
import i18n from 'enevti-app/translations/i18n';
import { NFTUtility } from 'enevti-app/types/core/chain/nft/NFTUtility';
import utilityToLabel from '../format/utilityToLabel';

const fromUtility: NFTUtility[] = ['content', 'gift', 'qr'];
const withUtility: NFTUtility[] = ['videocall'];

export default function nftToRedeemCalendarTitle(nft: NFT) {
  let ret: string = '';
  ret += `${i18n.t('nftDetails:redeem')} '${utilityToLabel(nft.utility)}' `;
  if (nft.creator.username) {
    if (fromUtility.includes(nft.utility)) {
      ret += `${i18n.t('nftDetails:redeemFrom')} '${nft.creator.username}' `;
    } else if (withUtility.includes(nft.utility)) {
      ret += `${i18n.t('nftDetails:redeemWith')} '${nft.creator.username}' `;
    }
  }
  ret += `(${nft.symbol}#${nft.serial})`;
  return ret;
}
