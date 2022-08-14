import { CommentItem } from 'enevti-app/store/slices/ui/view/comment';

type CommentItemArgs = Partial<CommentItem>;

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
    text: '',
    type: 'collection',
  };
}
