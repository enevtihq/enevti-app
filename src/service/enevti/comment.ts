import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { apiFetchVersioned } from 'enevti-app/utils/network';
import { urlGetCommentCollection, urlGetCommentNFT, urlGetReplyComment } from 'enevti-app/utils/constant/URLCreator';
import { APIResponseVersioned } from 'enevti-app/types/core/service/api';
import { COMMENT_INITIAL_LENGTH, REPLY_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { CommentAt, ReplyAt } from 'enevti-app/types/core/chain/engagement';
import { getCollectionIdFromRouteParam } from './collection';
import { getNFTIdFromRouteParam } from './nft';
import { getMyAddress } from './persona';
import { CommentItem, ReplyItem } from 'enevti-app/store/slices/ui/view/comment';

type CommentRoute = StackScreenProps<RootStackParamList, 'Comment'>['route']['params'];

async function fetchCollectionComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentAt>(urlGetCommentCollection(id, offset, limit, version, myAddress), signal);
}

async function fetchNFTComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentAt>(urlGetCommentNFT(id, offset, limit, version, myAddress), signal);
}

async function fetchCommentReply(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<ReplyAt>(urlGetReplyComment(id, offset, limit, version, myAddress), signal);
}

export async function getCollectionComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchCollectionComment(id, offset, limit, version, signal);
}

export async function getNFTComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchNFTComment(id, offset, limit, version, signal);
}

export async function getCommentReply(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  return await fetchCommentReply(id, offset, limit, version, signal);
}

export async function getInitialCollectionComment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchCollectionComment(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialNFTComment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchNFTComment(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialCommentReply(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  return await fetchCommentReply(id, 0, REPLY_INITIAL_LENGTH, 0, signal);
}

export async function getCollectionCommentByRouteParam(
  routeParam: CommentRoute,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
) {
  const collectionId = await getCollectionIdFromRouteParam(routeParam);
  return await getCollectionComment(collectionId, offset, limit, version, signal);
}

export async function getInitialCollectionCommentByRouteParam(
  routeParam: CommentRoute,
  signal?: AbortController['signal'],
) {
  const collectionId = await getCollectionIdFromRouteParam(routeParam);
  return await getInitialCollectionComment(collectionId, signal);
}

export async function getNFTCommentByRouteParam(
  routeParam: CommentRoute,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
) {
  const nftId = await getNFTIdFromRouteParam(routeParam);
  return await getNFTComment(nftId, offset, limit, version, signal);
}

export async function getInitialNFTCommentByRouteParam(routeParam: CommentRoute, signal?: AbortController['signal']) {
  const nftId = await getNFTIdFromRouteParam(routeParam);
  return await getInitialNFTComment(nftId, signal);
}

export function initCommentViewState(comment: CommentAt['comment']): CommentItem[] {
  return comment.map(c => ({
    ...c,
    isPosting: false,
    isLiking: false,
    highlighted: false,
    replies: [],
    replyPagination: {
      checkpoint: 0,
      version: 0,
    },
  }));
}

export function initReplyState(reply: ReplyAt['reply']): ReplyItem[] {
  return reply.map(r => ({
    ...r,
    isPosting: false,
    isLiking: false,
    highlighted: false,
  }));
}
