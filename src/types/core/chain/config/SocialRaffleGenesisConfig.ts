export type SocialRaffleGenesisConfig = {
  socialRaffle: {
    maxPrice: number;
    rewardsCutPercentage: number;
    blockInterval: number;
    maxRaffledPerCollection: number;
    maxRaffledPerProfile: number;
  };
};
