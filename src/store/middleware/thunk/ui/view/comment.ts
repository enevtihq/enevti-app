import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

import { APIResponseVersioned } from 'enevti-app/types/core/service/api';
import { CommentAt } from 'enevti-app/types/core/chain/engagement';
import {
  getCollectionCommentByRouteParam,
  getCommentReply,
  getInitialCollectionCommentByRouteParam,
  getInitialCommentReply,
  getInitialNFTCommentByRouteParam,
  getNFTCommentByRouteParam,
  initCommentViewState,
} from 'enevti-app/service/enevti/comment';
import {
  initCommentView,
  setCommentViewVersion,
  pushComment,
  setCommentViewPagination,
  setCommentViewReqStatus,
  setCommentViewLoaded,
  clearCommentViewByKey,
  selectCommentView,
  pushReply,
  selectCommentByIndex,
  setReplyPagination,
  resetCommentViewByKey,
} from 'enevti-app/store/slices/ui/view/comment';
import i18n from 'enevti-app/translations/i18n';
import { COMMENT_LIMIT, REPLY_LIMIT } from 'enevti-app/utils/constant/limit';

type CommentRoute = StackScreenProps<RootStackParamList, 'Comment'>['route'];
type LoadCommentArgs = { route: CommentRoute; reload: boolean };
type LoadReplyArgs = { route: CommentRoute; index: number };

export const loadComment = createAsyncThunk<void, LoadCommentArgs, AsyncThunkAPI>(
  'commentView/loadComment',
  async ({ route, reload = false }, { dispatch, signal }) => {
    try {
      reload && dispatch(showModalLoader());
      let commentResponse: APIResponseVersioned<CommentAt> | undefined;
      if (route.params.type === 'nft') {
        commentResponse = await getInitialNFTCommentByRouteParam(route.params, signal);
      } else if (route.params.type === 'collection') {
        commentResponse = await getInitialCollectionCommentByRouteParam(route.params, signal);
      }

      if (commentResponse === undefined) {
        throw Error(i18n.t('error:clientError'));
      }

      dispatch(initCommentView(route.key));
      dispatch(resetCommentViewByKey(route.key));
      dispatch(
        pushComment({
          key: route.key,
          value: initCommentViewState(commentResponse.data.data.comment),
        }),
      );
      dispatch(setCommentViewVersion({ key: route.key, value: Date.now() }));
      dispatch(
        setCommentViewPagination({
          key: route.key,
          value: {
            checkpoint: commentResponse.data.checkpoint,
            version: commentResponse.data.version,
          },
        }),
      );
      dispatch(setCommentViewReqStatus({ key: route.key, value: commentResponse.status }));
    } catch (err: any) {
      handleError(err);
    } finally {
      dispatch(setCommentViewLoaded({ key: route.key, value: true }));
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreComment = createAsyncThunk<void, LoadCommentArgs, AsyncThunkAPI>(
  'commentView/loadMoreComment',
  async ({ route }, { dispatch, getState, signal }) => {
    try {
      const commentView = selectCommentView(getState(), route.key);
      const offset = commentView.commentPagination.checkpoint;
      const version = commentView.commentPagination.version;
      if (commentView.comment.length !== version) {
        let commentResponse: APIResponseVersioned<CommentAt> | undefined;
        if (route.params.type === 'nft') {
          commentResponse = await getNFTCommentByRouteParam(route.params, offset, COMMENT_LIMIT, version, signal);
        } else if (route.params.type === 'collection') {
          commentResponse = await getCollectionCommentByRouteParam(
            route.params,
            offset,
            COMMENT_LIMIT,
            version,
            signal,
          );
        }

        if (commentResponse === undefined || commentResponse.status !== 200) {
          throw Error(i18n.t('error:clientError'));
        }

        dispatch(
          pushComment({
            key: route.key,
            value: initCommentViewState(commentResponse.data.data.comment),
          }),
        );
        dispatch(
          setCommentViewPagination({
            key: route.key,
            value: {
              checkpoint: commentResponse.data.checkpoint,
              version: commentResponse.data.version,
            },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const loadReply = createAsyncThunk<void, LoadReplyArgs, AsyncThunkAPI>(
  'commentView/loadReply',
  async ({ route, index }, { dispatch, getState, signal }) => {
    try {
      const comment = selectCommentByIndex(getState(), route.key, index);
      if (comment === undefined) {
        throw Error(i18n.t('error:clientError'));
      }
      const replyResponse = await getInitialCommentReply(comment.id, signal);
      if (replyResponse.status !== 200) {
        throw Error(i18n.t('error:clientError'));
      }
      dispatch(pushReply({ key: route.key, commentIndex: index, value: replyResponse.data.data.reply }));
      dispatch(
        setReplyPagination({
          key: route.key,
          commentIndex: index,
          value: {
            checkpoint: replyResponse.data.checkpoint,
            version: replyResponse.data.version,
          },
        }),
      );
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const loadMoreReply = createAsyncThunk<void, LoadReplyArgs, AsyncThunkAPI>(
  'commentView/loadMoreReply',
  async ({ route, index }, { dispatch, getState, signal }) => {
    try {
      const comment = selectCommentByIndex(getState(), route.key, index);
      if (comment === undefined) {
        throw Error(i18n.t('error:clientError'));
      }
      const offset = comment.replyPagination.checkpoint;
      const version = comment.replyPagination.version;
      if (comment.replies.length !== version) {
        const replyResponse = await getCommentReply(comment.id, offset, REPLY_LIMIT, version, signal);

        if (replyResponse.status !== 200) {
          throw Error(i18n.t('error:clientError'));
        }

        dispatch(
          pushReply({
            key: route.key,
            commentIndex: index,
            value: replyResponse.data.data.reply,
          }),
        );
        dispatch(
          setReplyPagination({
            key: route.key,
            commentIndex: index,
            value: {
              checkpoint: replyResponse.data.checkpoint,
              version: replyResponse.data.version,
            },
          }),
        );
      }
    } catch (err: any) {
      handleError(err);
    }
  },
);

export const unloadComment =
  (route: CommentRoute): AppThunk =>
  dispatch => {
    dispatch(clearCommentViewByKey(route.key));
  };
