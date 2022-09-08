export type StartVideoCallPayload = {
  socketId: string;
  nftId: string;
  caller: 'creator' | 'owner';
};

export type CallStatus =
  | 'authorizing'
  | 'starting'
  | 'ringing'
  | 'connected'
  | 'answered'
  | 'rejected'
  | 'ended'
  | 'disconnected'
  | 'error';

export type CallStartedParam = {
  emitter: string;
  twilioToken: string;
  callId: string;
};

export type CallAnsweredParam = {
  emitter: string;
  twilioToken: string;
};

export type CallErrorParam = {
  code: number;
  reason: string;
};

export type CallRejectedParam = {
  emitter: string;
};

export type CallEndedParam = {
  emitter: string;
};
