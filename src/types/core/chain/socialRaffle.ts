export type SocialRaffleChain = {
  pool: bigint;
  registrar: SocialRaffleRegistrarItem[];
};

export type SocialRaffleRegistrarItem = {
  id: Buffer;
  weight: bigint;
  candidate: Buffer[];
};

export type SocialRaffleRecord = {
  items: {
    id: Buffer;
    winner: Buffer;
    raffled: Buffer[];
  }[];
};
