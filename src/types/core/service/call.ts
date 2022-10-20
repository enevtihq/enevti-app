import { Persona } from '../account/persona';
import { NFTActivityName } from '../chain/nft/NFTActivity';

export type StartVideoCallHandlerPayload = {
  id: string;
  serial: string;
  rejectData: string;
  callerPersona: Persona;
  avatarUrl: string;
};

export type StartVideoCallPayload = {
  uuid: string;
  payload: StartVideoCallHandlerPayload;
  caller: 'creator' | 'owner';
};

export type StartVideoCallPayloadIOS = {
  uuid: string;
  callerName: string;
  handle: string;
  data: StartVideoCallHandlerPayload;
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
  | 'error'
  | 'exited';

export type CallStartedParam = {
  emitter: string;
  twilioToken: string;
  callId: string;
};

export type CallReconnectedParam = {
  emitter: string;
  callId: string;
};

export type SomeoneIsCallingParam = {
  emitter: string;
  nftId: string;
};

export type TokenReceivedParam = {
  emitter: string;
  twilioToken: string;
};

export type CallRefreshedParam = {
  emitter: string;
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
  nftId: string;
  emitter: string;
  signature: string;
};

export type CallEndedParam = {
  emitter: string;
};

export type OwnerRespondToSetStatusParam = {
  respond: 'accepted' | 'declined' | 'error';
};

export type VideoCallStatusChangedParams = NFTActivityName;

export type ChatMessage = {
  sender: string;
  timestamp: number;
  message: string;
};

export type TipReceived = {
  sender: string;
  amount: string;
};
