export type SocialRaffleGenesisConfig = {
  socialRaffle: {
    maxPrice: string;
    rewardsCutPercentage: number;
    blockInterval: number;
    maxRaffledPerCollection: number;
    maxRaffledPerProfile: number;
  };
};
