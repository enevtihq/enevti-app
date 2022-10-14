export const redeemableNftModule = {
  moduleID: 1000,
  createOnekindNft: 0,
  mintNft: 1,
  deliverSecret: 2,
  mintNftTypeQr: 3,
  likeNft: 4,
  likeCollection: 5,
  commentNft: 6,
  commentCollection: 7,
  likeComment: 8,
  likeReply: 9,
  replyComment: 10,
  commentCollectionClubs: 11,
  commentNftClubs: 12,
  replyCommentClubs: 13,
  likeReplyClubs: 14,
  likeCommentClubs: 15,
  setVideoCallRejected: 16,
  setVideoCallAnswered: 17,
};

export const personaModule = {
  moduleID: 1001,
  changePhoto: 0,
  changeTwitter: 1,
};

export const tokenModule = {
  moduleID: 2,
  transfer: 0,
};

export const dposModule = {
  moduleID: 5,
  registerDelegate: 0,
  vote: 1,
  unlock: 2,
  pom: 3,
};

export const stakingModule = dposModule;
