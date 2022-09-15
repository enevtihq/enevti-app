import { CommentItem, ReplyItem } from 'enevti-app/store/slices/ui/view/comment';

type CommentItemArgs = Partial<CommentItem>;
type ReplyItemArgs = Partial<ReplyItem>;

export function makeDummyComment(arg: CommentItemArgs): CommentItem {
  const comment = makeDefaultDummyComment();
  return {
    ...comment,
    ...arg,
  };
}

export function makeDefaultDummyComment(): CommentItem {
  return {
    id: '',
    date: Date.now(),
    highlighted: false,
    isPosting: false,
    isLiking: false,
    like: 0,
    liked: false,
    owner: {
      address: '',
      base32: '',
      photo: '',
      username: '',
    },
    replies: [],
    reply: 0,
    replyPagination: {
      checkpoint: 0,
      version: 0,
    },
    target: '',
    data: '',
    type: 'collection',
  };
}

export function makeDummyReply(arg: ReplyItemArgs): ReplyItem {
  const reply = makeDefaultDummyReply();
  return {
    ...reply,
    ...arg,
  };
}

export function makeDefaultDummyReply(): ReplyItem {
  return {
    id: '',
    date: Date.now(),
    highlighted: false,
    isPosting: false,
    isLiking: false,
    like: 0,
    liked: false,
    owner: {
      address: '',
      base32: '',
      photo: '',
      username: '',
    },
    target: '',
    data: '',
  };
}
