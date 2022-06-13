import { CollectionBase } from 'enevti-app/types/core/chain/collection';

export function isMintingAvailable(collection: CollectionBase) {
  const now = Date.now();
  return (
    (collection.minting.expire === 0 && collection.minting.available > 0) ||
    (collection.minting.expire > now && collection.minting.available > 0)
  );
}
