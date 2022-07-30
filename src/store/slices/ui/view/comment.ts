import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { PaginationStore } from 'enevti-app/types/ui/store/PaginationStore';
import { Comment, Reply } from 'enevti-app/types/core/chain/engagement';

export type CommentItem = Comment & {
  isPosting: boolean;
  highlighted: boolean;
  replies: Reply[];
  replyPagination: PaginationStore;
};

type CommentViewState = {
  commentPagination: PaginationStore;
  reqStatus: number;
  version: number;
  fetchedVersion: number;
  loaded: boolean;
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
    setComment: (comment, action: PayloadAction<{ key: string; commentIndex: number; value: CommentItem }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex] = action.payload.value;
    },
    pushComment: (comment, action: PayloadAction<{ key: string; value: CommentItem[] }>) => {
      comment[action.payload.key].comment = comment[action.payload.key].comment.concat(action.payload.value);
      comment[action.payload.key].commentPagination.version++;
    },
    unshiftComment: (comment, action: PayloadAction<{ key: string; value: CommentItem[] }>) => {
      comment[action.payload.key].comment = action.payload.value.concat(comment[action.payload.key].comment);
      comment[action.payload.key].commentPagination.version++;
    },
    setCommentViewPagination: (comment, action: PayloadAction<{ key: string; value: PaginationStore }>) => {
      comment[action.payload.key].commentPagination = { ...action.payload.value };
    },
    pushReply: (comment, action: PayloadAction<{ key: string; commentIndex: number; value: Reply[] }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = comment[action.payload.key].comment[
        action.payload.commentIndex
      ].replies.concat(action.payload.value);
    },
    unshiftReply: (comment, action: PayloadAction<{ key: string; commentIndex: number; value: Reply[] }>) => {
      comment[action.payload.key].comment[action.payload.commentIndex].replies = action.payload.value.concat(
        comment[action.payload.key].comment[action.payload.commentIndex].replies,
      );
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
  unshiftComment,
  setCommentViewPagination,
  pushReply,
  unshiftReply,
  setReplyPagination,
  clearCommentViewByKey,
  resetCommentViewByKey,
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
