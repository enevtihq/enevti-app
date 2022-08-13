import { Persona } from 'enevti-app/types/core/account/persona';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { NFT } from 'enevti-app/types/core/chain/nft';

export const PROFILE_MENTION_TRIGGER = '@';
export const COLLECTION_MENTION_TRIGGER = '$';
export const NFT_MENTION_TRIGGER = '*';

export function createProfileMention(persona: Persona) {
  return `${PROFILE_MENTION_TRIGGER}[${persona.username}](${persona.address})`;
}

export function createCollectionMention(collection: Collection) {
  return `${COLLECTION_MENTION_TRIGGER}[${collection.name}](${collection.id})`;
}

export function createNFTMention(nft: NFT) {
  return `${NFT_MENTION_TRIGGER}[${nft.symbol}#${nft.serial}](${nft.id})`;
}
