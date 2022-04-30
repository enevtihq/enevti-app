export type AddStakeProps = {
  votes: {
    delegateAddress: Buffer;
    amount: bigint;
  }[];
};

export type AddStakeUI = {
  votes: {
    delegateAddress: string;
    amount: string;
  }[];
};
