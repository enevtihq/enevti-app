export type PaymentAction = {
  loaded: boolean;
  type:
    | 'createNFTOneKind'
    | 'mintCollection'
    | 'mintCollectionByQR'
    | 'addStake'
    | 'registerUsername'
    | 'deliverSecret'
    | 'transferToken'
    | 'likeNFT'
    | 'likeCollection'
    | 'likeComment'
    | 'likeCommentClubs'
    | 'likeReply'
    | 'likeReplyClubs'
    | 'commentNFT'
    | 'commentNftClubs'
    | 'commentCollection'
    | 'commentCollectionClubs'
    | 'replyComment'
    | 'replyCommentClubs'
    | 'cancel'
    | '';
  icon: string;
  name: string;
  description: string;
  details?: string;
  amount: string;
  currency: string;
  payload: string;
  meta: string;
};

export type PaymentFee = {
  loaded: boolean;
  priority: 'low' | 'normal' | 'high' | 'custom';
  gas: string;
  base: string;
  platform: string;
};

export type PaymentStatus = {
  id: string;
  key: string;
  action: PaymentAction['type'];
  type: 'idle' | 'initiated' | 'process' | 'success' | 'error' | 'cancel';
  message: string;
};

export type PaymentStatusInReducer = Partial<PaymentStatus>;

export type PaymentState = {
  show: boolean;
  mode: 'full' | 'compact' | 'silent';
  status: PaymentStatus;
  action: PaymentAction;
  fee: PaymentFee;
};
