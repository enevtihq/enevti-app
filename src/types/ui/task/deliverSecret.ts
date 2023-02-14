import { NFT } from 'enevti-types/chain/nft';

export type DeliverSecretPayload = { id: string; secret: NFT['redeem']['secret'] };
