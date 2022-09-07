export type StartVideoCallPayload = {
  socketId: string;
  nftId: string;
  caller: 'creator' | 'owner';
  twilioToken: string;
};
