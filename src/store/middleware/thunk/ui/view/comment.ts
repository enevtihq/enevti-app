import { handleError } from 'enevti-app/utils/error/handle';
import { hideModalLoader, showModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk, AsyncThunkAPI } from 'enevti-app/store/state';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

import { APIResponseVersioned } from 'enevti-types/service/api';
import { Comment, CommentAt, CommentClubsAt } from 'enevti-types/chain/engagement';
import {
  getCollectionCommentByRouteParam,
  getCollectionCommentClubsByRouteParam,
  getCommentClubsReply,
  getCommentReply,
  getInitialCollectionCommentByRouteParam,
  getInitialCollectionCommentClubsByRouteParam,
  getInitialCommentClubsReply,
  getInitialCommentReply,
  getInitialMomentComment,
  getInitialMomentCommentClubs,
  getInitialNFTCommentByRouteParam,
  getInitialNFTCommentClubsByRouteParam,
  getMomentComment,
  getMomentCommentClubs,
  getNFTCommentByRouteParam,
  getNFTCommentClubsByRouteParam,
  initCommentViewState,
  initReplyState,
} from 'enevti-app/service/enevti/comment';
import {
  initCommentView,
  pushComment,
  setCommentViewReqStatus,
  setCommentViewLoaded,
  clearCommentViewByKey,
  selectCommentView,
  pushReply,
  selectCommentByIndex,
  setComment,
  CommentItem,
  deleteComment,
  setCommentReplying,
  resetCommentReplying,
  addCommentReplyCount,
  subtractCommentReplyCount,
  addReplyPaginationVersion,
  setReplyPaginationCheckpoint,
  setReply,
  setCommentReplyingOnReply,
  resetCommentReplyingOnReply,
  setCommentAuthorized,
  setCommentView,
  commentInitialStateItem,
} from 'enevti-app/store/slices/ui/view/comment';
import i18n from 'enevti-app/translations/i18n';
import { COMMENT_LIMIT, REPLY_LIMIT } from 'enevti-app/utils/constant/limit';
import { getIsNFTOwnerOrCreatorByRouteParam } from 'enevti-app/service/enevti/nft';
import { getIsCollectionOwnerOrCreatorByRouteParam } from 'enevti-app/service/enevti/collection';
import { getIsMomentOwnerOrCreator } from 'enevti-app/service/enevti/moment';

type CommentRoute = StackScreenProps<RootStackParamList, 'Comment'>['route'];
type LoadCommentArgs = { route: CommentRoute; type: 'common' | 'clubs'; reload?: boolean };
type LoadReplyArgs = { route: CommentRoute; type: 'common' | 'clubs'; index: number };

export const getCommentKey = (route: CommentRoute, type: 'common' | 'clubs') => `${type}${route.key}`;

export const loadComment = createAsyncThunk<void, LoadCommentArgs, AsyncThunkAPI>(
  'commentView/loadComment',
  async ({ route, type, reload = false }, { dispatch, signal }) => {
    const key = getCommentKey(route, type);
    let status: number = 200;
    try {
      reload && dispatch(showModalLoader());
      dispatch(initCommentView(key));

      if (type === 'clubs') {
        if (route.params.type === 'nft') {
          const isOwnerOrCreatorResponse = await getIsNFTOwnerOrCreatorByRouteParam(route.params, signal);
          status = isOwnerOrCreatorResponse.status;
          if (isOwnerOrCreatorResponse.status === 200 && !isOwnerOrCreatorResponse.data) {
            dispatch(setCommentAuthorized({ key, value: false }));
            return;
          }
        } else if (route.params.type === 'collection') {
          const isOwnerOrCreatorResponse = await getIsCollectionOwnerOrCreatorByRouteParam(route.params, signal);
          status = isOwnerOrCreatorResponse.status;
          if (isOwnerOrCreatorResponse.status === 200 && !isOwnerOrCreatorResponse.data) {
            dispatch(setCommentAuthorized({ key, value: false }));
            return;
          }
        } else if (route.params.type === 'moment') {
          const isOwnerOrCreatorResponse = await getIsMomentOwnerOrCreator(route.params.arg, signal);
          status = isOwnerOrCreatorResponse.status;
          if (isOwnerOrCreatorResponse.status === 200 && !isOwnerOrCreatorResponse.data) {
            dispatch(setCommentAuthorized({ key, value: false }));
            return;
          }
        }
      }

      let commentResponse: APIResponseVersioned<unknown> | undefined;
      let commentData: Comment[] = [];
      if (route.params.type === 'nft') {
        if (type === 'common') {
          commentResponse = await getInitialNFTCommentByRouteParam(route.params, signal);
        } else if (type === 'clubs') {
          commentResponse = await getInitialNFTCommentClubsByRouteParam(route.params, signal);
        }
      } else if (route.params.type === 'collection') {
        if (type === 'common') {
          commentResponse = await getInitialCollectionCommentByRouteParam(route.params, signal);
        } else if (type === 'clubs') {
          commentResponse = await getInitialCollectionCommentClubsByRouteParam(route.params, signal);
        }
      } else if (route.params.type === 'moment') {
        if (type === 'common') {
          commentResponse = await getInitialMomentComment(route.params.arg, signal);
        } else if (type === 'clubs') {
          commentResponse = await getInitialMomentCommentClubs(route.params.arg, signal);
        }
      }

      if (commentResponse === undefined) {
        throw Error(i18n.t('error:clientError'));
      } else {
        if (type === 'common') {
          commentData = (commentResponse as APIResponseVersioned<CommentAt>).data.data.comment;
        } else if (type === 'clubs') {
          commentData = (commentResponse as APIResponseVersioned<CommentClubsAt>).data.data.clubs;
        }
      }

      status = commentResponse.status;

      dispatch(
        setCommentView({
          key,
          value: {
            ...commentInitialStateItem,
            comment: initCommentViewState(commentData),
            version: Date.now(),
            commentPagination: {
              checkpoint: commentResponse.data.checkpoint,
              version: commentResponse.data.version,
            },
            reqStatus: status,
            loaded: true,
          },
        }),
      );
    } catch (err: any) {
      handleError(err);
      dispatch(setCommentViewReqStatus({ key, value: status }));
      dispatch(setCommentViewLoaded({ key, value: true }));
    } finally {
      reload && dispatch(hideModalLoader());
    }
  },
);

export const loadMoreComment = createAsyncThunk<void, LoadCommentArgs, AsyncThunkAPI>(
  'commentView/loadMoreComment',
  async ({ route, type }, { dispatch, getState, signal }) => {
    const key = getCommentKey(route, type);
    try {
      const commentView = selectCommentView(getState(), key);
      const offset = commentView.commentPagination.checkpoint;
      const version = commentView.commentPagination.version;
      if (commentView.comment.length !== version) {
        let commentData: Comment[] = [];
        let commentResponse: APIResponseVersioned<unknown> | undefined;
        if (route.params.type === 'nft') {
          if (type === 'common') {
            commentResponse = await getNFTCommentByRouteParam(route.params, offset, COMMENT_LIMIT, version, signal);
          } else if (type === 'clubs') {
            commentResponse = await getNFTCommentClubsByRouteParam(
              route.params,
              offset,
              COMMENT_LIMIT,
              version,
              signal,
            );
          }
        } else if (route.params.type === 'collection') {
          if (type === 'common') {
            commentResponse = await getCollectionCommentByRouteParam(
              route.params,
              offset,
              COMMENT_LIMIT,
              version,
              signal,
            );
          } else if (type === 'clubs') {
            commentResponse = await getCollectionCommentClubsByRouteParam(
              route.params,
              offset,
              COMMENT_LIMIT,
              version,
              signal,
            );
          }
        } else if (route.params.type === 'moment') {
          if (type === 'common') {
            commentResponse = await getMomentComment(route.params.arg, offset, COMMENT_LIMIT, version, signal);
          } else if (type === 'clubs') {
            commentResponse = await getMomentCommentClubs(route.params.arg, offset, COMMENT_LIMIT, version, signal);
          }
        }

        if (commentResponse === undefined || commentResponse.status !== 200) {
          throw Error(i18n.t('error:clientError'));
        } else {
          if (type === 'common') {
            commentData = (commentResponse as APIResponseVersioned<CommentAt>).data.data.comment;
          } else if (type === 'clubs') {
            commentData = (commentResponse as APIResponseVersioned<CommentClubsAt>).data.data.clubs;
          }
        }

        dispatch(
          pushComment({
            key,
            value: initCommentViewState(commentData),
            pagination: {
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
  async ({ route, type, index }, { dispatch, getState, signal }) => {
    const key = getCommentKey(route, type);
    try {
      const comment = selectCommentByIndex(getState(), key, index);
      if (comment === undefined) {
        throw Error(i18n.t('error:clientError'));
      }
      const replyResponse =
        type === 'common'
          ? await getInitialCommentReply(comment.id, signal)
          : type === 'clubs'
          ? await getInitialCommentClubsReply(comment.id, signal)
          : undefined;
      if (replyResponse === undefined || replyResponse.status !== 200) {
        throw Error(i18n.t('error:clientError'));
      }
      dispatch(
        pushReply({
          key,
          commentIndex: index,
          value: initReplyState(replyResponse.data.data.reply),
          pagination: {
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
  async ({ route, type, index }, { dispatch, getState, signal }) => {
    const key = getCommentKey(route, type);
    try {
      const comment = selectCommentByIndex(getState(), key, index);
      if (comment === undefined) {
        throw Error(i18n.t('error:clientError'));
      }
      const offset = comment.replyPagination.checkpoint;
      const version = comment.replyPagination.version;
      if (comment.replies.length !== version) {
        const replyResponse =
          type === 'common'
            ? await getCommentReply(comment.id, offset, REPLY_LIMIT, 0, signal)
            : type === 'clubs'
            ? await getCommentClubsReply(comment.id, offset, REPLY_LIMIT, 0, signal)
            : undefined;

        if (replyResponse === undefined || replyResponse.status !== 200) {
          throw Error(i18n.t('error:clientError'));
        }

        dispatch(
          pushReply({
            key,
            commentIndex: index,
            value: initReplyState(replyResponse.data.data.reply),
            pagination: {
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
  (route: CommentRoute, type: 'common' | 'clubs'): AppThunk =>
  dispatch => {
    const key = getCommentKey(route, type);
    dispatch(clearCommentViewByKey(key));
  };

export const setCommentById =
  ({
    route,
    id,
    type,
    comment,
  }: {
    route: CommentRoute;
    type: 'common' | 'clubs';
    id: string;
    comment: Partial<CommentItem>;
  }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === id);
    dispatch(setComment({ key, commentIndex: index, value: comment }));
  };

export const deleteCommentById =
  ({ route, type, id }: { route: CommentRoute; type: 'common' | 'clubs'; id: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === id);
    dispatch(deleteComment({ key, commentIndex: index }));
  };

export const addCommentLikeById =
  ({ route, type, id }: { route: CommentRoute; type: 'common' | 'clubs'; id: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === id);
    dispatch(setComment({ key, commentIndex: index, value: { like: commentState.comment[index].like + 1 } }));
  };

export const addCommentReplyCountById =
  ({ route, type, id }: { route: CommentRoute; type: 'common' | 'clubs'; id: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === id);
    dispatch(addCommentReplyCount({ key, commentIndex: index }));
  };

export const subtractCommentReplyCountById =
  ({ route, type, id }: { route: CommentRoute; type: 'common' | 'clubs'; id: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === id);
    dispatch(subtractCommentReplyCount({ key, commentIndex: index }));
  };

export const setReplying =
  ({ route, type, index }: { route: CommentRoute; type: 'common' | 'clubs'; index: number }): AppThunk =>
  dispatch => {
    const key = getCommentKey(route, type);
    dispatch(setComment({ key, commentIndex: index, value: { highlighted: true } }));
    dispatch(setCommentReplying({ key, value: index }));
  };

export const resetReplying =
  ({ route, type }: { route: CommentRoute; type: 'common' | 'clubs' }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    if (commentState.replying !== undefined && commentState.replying > -1) {
      dispatch(setComment({ key, commentIndex: commentState.replying, value: { highlighted: false } }));
      dispatch(resetCommentReplying(key));
    }
  };

export const setReplyingOnReply =
  ({
    route,
    commentIndex,
    type,
    replyIndex,
  }: {
    route: CommentRoute;
    type: 'common' | 'clubs';
    commentIndex: number;
    replyIndex: number;
  }): AppThunk =>
  dispatch => {
    const key = getCommentKey(route, type);
    dispatch(setReply({ key, commentIndex, replyIndex, value: { highlighted: true } }));
    dispatch(setCommentReplying({ key, value: commentIndex }));
    dispatch(setCommentReplyingOnReply({ key, value: replyIndex }));
  };

export const resetReplyingOnReply =
  ({ route, type, commentIndex }: { route: CommentRoute; type: 'common' | 'clubs'; commentIndex: number }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    if (commentState.replyingOnReply !== undefined && commentState.replyingOnReply > -1) {
      dispatch(
        setReply({
          key,
          commentIndex,
          replyIndex: commentState.replyingOnReply,
          value: { highlighted: false },
        }),
      );
      dispatch(resetCommentReplyingOnReply(key));
    }
  };

export const addReplyPaginationVersionByCommentId =
  ({ route, type, commentId }: { route: CommentRoute; type: 'common' | 'clubs'; commentId: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === commentId);
    dispatch(addReplyPaginationVersion({ key, commentIndex: index }));
  };

export const setReplyPaginationCheckpointToRepliesLength =
  ({ route, type, commentId }: { route: CommentRoute; type: 'common' | 'clubs'; commentId: string }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const index = commentState.comment.findIndex(c => c.id === commentId);
    dispatch(
      setReplyPaginationCheckpoint({
        key,
        commentIndex: index,
        checkpoint: commentState.comment[index].replies.length,
      }),
    );
  };

export const clearReplying =
  ({ route, type }: { route: CommentRoute; type: 'common' | 'clubs' }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    const commentIndex = commentState.replying;
    if (commentIndex !== undefined) {
      dispatch(resetReplyingOnReply({ route, type, commentIndex }));
      dispatch(resetReplying({ route, type }));
    }
  };

export const addReplyLikeById =
  ({
    route,
    type,
    commentIndex,
    replyIndex,
  }: {
    route: CommentRoute;
    type: 'common' | 'clubs';
    commentIndex: number;
    replyIndex: number;
  }): AppThunk =>
  (dispatch, getState) => {
    const key = getCommentKey(route, type);
    const commentState = selectCommentView(getState(), key);
    dispatch(
      setReply({
        key,
        commentIndex,
        replyIndex,
        value: { like: commentState.comment[commentIndex].replies[replyIndex].like + 1 },
      }),
    );
  };
