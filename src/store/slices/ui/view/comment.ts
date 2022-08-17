import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { Comment, Reply } from 'enevti-app/types/core/chain/engagement';

type EngagementItemBase = {
  isPosting: boolean;
  isLiking: boolean;
  highlighted: boolean;
};

export type ReplyItem = Reply & EngagementItemBase;

export type CommentItem = Comment &
  EngagementItemBase & {
    replies: ReplyItem[];
    replyPagination: PaginationStore;
  };

type CommentViewState = {
  commentPagination: PaginationStore;
  reqStatus: number;
  version: number;
  fetchedVersion: number;
  loaded: boolean;
  replying?: number;
  comment: CommentItem[];
};

type CommentViewStore = {
  [key: string]: CommentViewState;
};

const initialStateItem: CommentViewState = {
  commentPagination: {
    checkpoint: 0,
    version: 0,
  },
  loaded: false,
  version: 0,
  fetchedVersion: 0,
  reqStatus: 0,
  comment: [],
};

const initialState: CommentViewStore = {};

const commentViewSlice = createSlice({
  name: 'commentView',
  initialState,
  reducers: {
    initCommentView: (comment, action: PayloadAction<string>) => {
      Object.assign(comment, { [action.payload]: {} });
    },
    setCommentView: (comment, action: PayloadAction<{ key: string; value: Record<string, any> }>) => {
      Object.assign(comment, {
        [action.payload.key]: action.payload.value,
      });
    },
    setCommentFetchedVersion: (comment, action: PayloadAction<{ key: string; value: number }>) => {
      comment[action.payload.key].fetchedVersion = action.payload.value;
    },
    setCommentReplying: (comment, action: PayloadAction<{ key: string; value: number }>) => {
      comment[action.payload.key].replying = action.payload.value;
    },
    resetCommentReplying: (comment, action: PayloadAction<string>) => {
      comment[action.payload].replying = undefined;
    },
    setComment: (
      comment,
      action: PayloadAction<{ key: string; commentIndex: number; value: Partial<CommentItem> }>,
    ) => {
      Object.assign(comment, {
        [action.payload.key]: Object.assign({}, comment[action.payload.key], {
          comment: comment[action.payload.key].comment.map((c, i) =>
            i === action.payload.commentIndex ? Object.assign({}, c, action.payload.value) : c,
          ),
        }),
      });
    },
    pushComment: (comment, action: PayloadAction<{ key: string; value: CommentItem[] }>) => {
      comment[action.payload.key].comment = comment[action.payload.key].comment.concat(action.payload.value);
    },
    popComment: (comment, action: PayloadAction<{ key: string; value: CommentItem[] }>) => {
      comment[action.payload.key].comment = comment[action.payload.key].comment.slice(0, -1);
    },
    unshiftComment: (comment, action: PayloadAction<{ key: string; value: CommentItem[] }>) => {
      comment[action.payload.key].comment = action.payload.value.concat(comment[action.payload.key].comment);
    },
    shiftComment: (comment, action: PayloadAction<{ key: string }>) => {
      comment[action.payload.key].comment = comment[action.payload.key].comment.slice(1);
    },
    deleteComment: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment = [
        ...comment[action.payload.key].comment.slice(0, action.payload.commentIndex),
        ...comment[action.payload.key].comment.slice(action.payload.commentIndex + 1),
      ];
    },
    addCommentReplyCount: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].reply++;
    },
    subtractCommentReplyCount: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].reply--;
    },
    addCommentViewPaginationCheckpoint: (comment, action: PayloadAction<{ key: string }>) => {
      comment[action.payload.key].commentPagination.checkpoint++;
    },
    addCommentViewPaginationVersion: (comment, action: PayloadAction<{ key: string }>) => {
      comment[action.payload.key].commentPagination.version++;
    },
    subtractCommentViewPaginationCheckpoint: (comment, action: PayloadAction<{ key: string }>) => {
      comment[action.payload.key].commentPagination.checkpoint--;
    },
    subtractCommentViewPaginationVersion: (comment, action: PayloadAction<{ key: string }>) => {
      comment[action.payload.key].commentPagination.version--;
    },
    setCommentViewPagination: (comment, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      comment[action.payload.key].commentPagination = { ...action.payload.value };
    },
    setReply: (
      comment,
      action: PayloadAction<{ key: string; commentIndex: number; replyIndex: number; value: Partial<ReplyItem> }>,
    ) => {
      Object.assign(comment, {
        [action.payload.key]: Object.assign(comment[action.payload.key], {
          comment: comment[action.payload.key].comment.map((c, i) =>
            i === action.payload.commentIndex
              ? Object.assign({}, c, {
                  replies: comment[action.payload.key].comment[i].replies.map((r, i2) =>
                    i2 === action.payload.replyIndex ? Object.assign({}, r, action.payload.value) : r,
                  ),
                })
              : c,
          ),
        }),
      });
    },
    pushReply: (comment, action: PayloadAction<{ key: string; commentIndex: number; value: ReplyItem[] }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = comment[action.payload.key].comment[
        action.payload.commentIndex
      ].replies.concat(action.payload.value);
    },
    popReply: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = comment[action.payload.key].comment[
        action.payload.commentIndex
      ].replies.slice(0, -1);
    },
    unshiftReply: (comment, action: PayloadAction<{ key: string; commentIndex: number; value: ReplyItem[] }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = action.payload.value.concat(
        comment[action.payload.key].comment[action.payload.commentIndex].replies,
      );
    },
    shiftReply: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies =
        comment[action.payload.key].comment[action.payload.commentIndex].replies.slice(1);
    },
    deleteReply: (comment, action: PayloadAction<{ key: string; commentIndex: number; replyIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = [
        ...comment[action.payload.key].comment[action.payload.commentIndex].replies.slice(0, action.payload.replyIndex),
        ...comment[action.payload.key].comment[action.payload.commentIndex].replies.slice(
          action.payload.replyIndex + 1,
        ),
      ];
    },
    addReplyPaginationCheckpoint: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination.checkpoint++;
    },
    setReplyPaginationCheckpoint: (
      comment,
      action: PayloadAction<{ key: string; commentIndex: number; checkpoint: number }>,
    ) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination.checkpoint =
        action.payload.checkpoint;
    },
    addReplyPaginationVersion: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination.version++;
    },
    subtractReplyPaginationCheckpoint: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination.checkpoint--;
    },
    subtractReplyPaginationVersion: (comment, action: PayloadAction<{ key: string; commentIndex: number }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination.version--;
    },
    setReplyPagination: (
      comment,
      action: PayloadAction<{ key: string; commentIndex: number; value: PaginationStore }>,
    ) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replyPagination = { ...action.payload.value };
    },
    setCommentViewVersion: (comment, action: PayloadAction<{ key: string; value: number }>) => {
      comment[action.payload.key].version = action.payload.value;
    },
    setCommentViewLoaded: (comment, action: PayloadAction<{ key: string; value: boolean }>) => {
      comment[action.payload.key].loaded = action.payload.value;
    },
    setCommentViewReqStatus: (comment, action: PayloadAction<{ key: string; value: number }>) => {
      comment[action.payload.key].reqStatus = action.payload.value;
    },
    clearCommentViewByKey: (comment, action: PayloadAction<string>) => {
      delete comment[action.payload];
    },
    resetCommentViewByKey: (comment, action: PayloadAction<string>) => {
      Object.assign(comment[action.payload], initialStateItem);
    },
    resetCommentView: () => {
      return initialState;
    },
  },
});

export const {
  initCommentView,
  setCommentView,
  setCommentFetchedVersion,
  setCommentViewLoaded,
  setCommentViewVersion,
  setCommentViewReqStatus,
  setComment,
  pushComment,
  popComment,
  unshiftComment,
  shiftComment,
  deleteComment,
  addCommentReplyCount,
  subtractCommentReplyCount,
  addCommentViewPaginationCheckpoint,
  addCommentViewPaginationVersion,
  subtractCommentViewPaginationVersion,
  subtractCommentViewPaginationCheckpoint,
  setCommentViewPagination,
  setReply,
  pushReply,
  popReply,
  unshiftReply,
  shiftReply,
  deleteReply,
  addReplyPaginationCheckpoint,
  addReplyPaginationVersion,
  subtractReplyPaginationCheckpoint,
  subtractReplyPaginationVersion,
  setReplyPaginationCheckpoint,
  setReplyPagination,
  clearCommentViewByKey,
  resetCommentViewByKey,
  setCommentReplying,
  resetCommentReplying,
  resetCommentView,
} = commentViewSlice.actions;
export default commentViewSlice.reducer;

export const selectCommentView = createSelector(
  [(state: RootState) => state.ui.view.comment, (state: RootState, key: string) => key],
  (comment: CommentViewStore, key: string) => (comment.hasOwnProperty(key) ? comment[key] : initialStateItem),
);

export const selectCommentByIndex = createSelector(
  [
    (state: RootState) => state.ui.view.comment,
    (state: RootState, key: string) => key,
    (state: RootState, key: string, index: number) => index,
  ],
  (comment: CommentViewStore, key: string, index: number) =>
    comment.hasOwnProperty(key) ? comment[key].comment[index] : undefined,
);

export const isThereAnyNewComment = createSelector(
  [(state: RootState) => state.ui.view.comment, (state: RootState, key: string) => key],
  (comment: CommentViewStore, key: string) =>
    comment.hasOwnProperty(key) ? comment[key].fetchedVersion > comment[key].version : false,
);

export const isCommentUndefined = createSelector(
  [(state: RootState) => state.ui.view.comment, (state: RootState, key: string) => key],
  (comment: CommentViewStore, key: string) => (comment.hasOwnProperty(key) ? !comment[key].loaded : true),
);
