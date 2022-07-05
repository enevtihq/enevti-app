import { NFT } from 'enevti-app/types/core/chain/nft';

export type DeliverSecretPayload = { id: string; secret: NFT['redeem']['secret'] };
