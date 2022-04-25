type NFTRarityStat = {
  rank: number;
  percent: number;
};

type NFTRarityTrait = {
  key: string;
  value: string;
};

export type NFTRarity = {
  stat: NFTRarityStat;
  trait: NFTRarityTrait[];
};
