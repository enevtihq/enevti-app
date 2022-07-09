export type BuybackRegistrar = {
  registrar: BuybackRegistrarItem[];
};

export type BuybackRegistrarItem = {
  collectionId: Buffer;
  weight: bigint;
  candidate: Buffer[];
};
