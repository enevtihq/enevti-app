import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from 'enevti-app/store/state';
import { Comment } from 'enevti-app/types/core/chain/engagement';

type CommentSessionState = {
  value: string;
  target?: Comment;
};

type CommentSessionStore = {
  [key: string]: CommentSessionState;
};

const initialStateItem: CommentSessionState = {
  value: '',
  target: undefined,
};

const initialState: CommentSessionStore = {};

const commentSessionSlice = createSlice({
  name: 'commentSession',
  initialState,
  reducers: {
    initCommentSession: (comment, action: PayloadAction<string>) => {
      Object.assign(comment, { [action.payload]: {} });
    },
    setCommentSessionValue: (comment, action: PayloadAction<{ key: string; value: string }>) => {
      Object.assign(comment, {
        [action.payload.key]: Object.assign({}, comment[action.payload.key], { value: action.payload.value }),
      });
    },
    setCommentSessionTarget: (comment, action: PayloadAction<{ key: string; value: Comment }>) => {
      Object.assign(comment, {
        [action.payload.key]: Object.assign({}, comment[action.payload.key], { target: action.payload.value }),
      });
    },
    setCommentSession: (comment, action: PayloadAction<{ key: string; value: CommentSessionState }>) => {
      Object.assign(comment, {
        [action.payload.key]: action.payload.value,
      });
    },
    clearCommentSessionByKey: (comment, action: PayloadAction<string>) => {
      delete comment[action.payload];
    },
    resetCommentSessionByKey: (comment, action: PayloadAction<string>) => {
      Object.assign(comment[action.payload], initialStateItem);
    },
    resetCommentSession: () => {
      return initialState;
    },
  },
});

export const {
  initCommentSession,
  setCommentSession,
  setCommentSessionTarget,
  setCommentSessionValue,
  clearCommentSessionByKey,
  resetCommentSession,
  resetCommentSessionByKey,
} = commentSessionSlice.actions;
export default commentSessionSlice.reducer;

export const selectCommentSession = createSelector(
  [(state: RootState) => state.session.engagement.comment, (state: RootState, key: string) => key],
  (comment: CommentSessionStore, key: string) => (comment.hasOwnProperty(key) ? comment[key] : undefined),
);
