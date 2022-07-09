import { CollectionIdAsset, NFTIdAsset } from './id';

export type RegisteredNameAsset = {
  id: CollectionIdAsset;
};

export type RegisteredSymbolAsset = {
  id: CollectionIdAsset;
};

export type RegisteredSerialAsset = {
  id: NFTIdAsset;
};

export type RegisteredUsernameAsset = {
  address: Buffer;
};
