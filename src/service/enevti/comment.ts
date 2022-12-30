import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { apiFetchVersioned } from 'enevti-app/utils/app/network';
import {
  urlGetCommentClubsCollection,
  urlGetCommentClubsMoment,
  urlGetCommentClubsNFT,
  urlGetCommentCollection,
  urlGetCommentMoment,
  urlGetCommentNFT,
  urlGetReplyComment,
  urlGetReplyCommentClubs,
} from 'enevti-app/utils/constant/URLCreator';
import { APIResponseVersioned } from 'enevti-app/types/core/service/api';
import { COMMENT_INITIAL_LENGTH, REPLY_INITIAL_LENGTH } from 'enevti-app/utils/constant/limit';
import { Comment, CommentAt, CommentClubsAt, ReplyAt } from 'enevti-app/types/core/chain/engagement';
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

async function fetchCollectionCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentClubsAt>(
    urlGetCommentClubsCollection(id, offset, limit, version, myAddress),
    signal,
  );
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

async function fetchNFTCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentClubsAt>(urlGetCommentClubsNFT(id, offset, limit, version, myAddress), signal);
}

async function fetchMomentComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentAt>(urlGetCommentMoment(id, offset, limit, version, myAddress), signal);
}

async function fetchMomentCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<CommentClubsAt>(
    urlGetCommentClubsMoment(id, offset, limit, version, myAddress),
    signal,
  );
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

async function fetchCommentClubsReply(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  const myAddress = await getMyAddress();
  return await apiFetchVersioned<ReplyAt>(urlGetReplyCommentClubs(id, offset, limit, version, myAddress), signal);
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

export async function getCollectionCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchCollectionCommentClubs(id, offset, limit, version, signal);
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

export async function getNFTCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchNFTCommentClubs(id, offset, limit, version, signal);
}

export async function getMomentComment(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchMomentComment(id, offset, limit, version, signal);
}

export async function getMomentCommentClubs(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchMomentCommentClubs(id, offset, limit, version, signal);
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

export async function getCommentClubsReply(
  id: string,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  return await fetchCommentClubsReply(id, offset, limit, version, signal);
}

export async function getInitialCollectionComment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchCollectionComment(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialCollectionCommentClubs(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchCollectionCommentClubs(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialNFTComment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchNFTComment(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialNFTCommentClubs(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchNFTCommentClubs(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialMomentComment(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentAt>> {
  return await fetchMomentComment(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialMomentCommentClubs(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<CommentClubsAt>> {
  return await fetchMomentCommentClubs(id, 0, COMMENT_INITIAL_LENGTH, 0, signal);
}

export async function getInitialCommentReply(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  return await fetchCommentReply(id, 0, REPLY_INITIAL_LENGTH, 0, signal);
}

export async function getInitialCommentClubsReply(
  id: string,
  signal?: AbortController['signal'],
): Promise<APIResponseVersioned<ReplyAt>> {
  return await fetchCommentClubsReply(id, 0, REPLY_INITIAL_LENGTH, 0, signal);
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

export async function getCollectionCommentClubsByRouteParam(
  routeParam: CommentRoute,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
) {
  const collectionId = await getCollectionIdFromRouteParam(routeParam);
  return await getCollectionCommentClubs(collectionId, offset, limit, version, signal);
}

export async function getInitialCollectionCommentByRouteParam(
  routeParam: CommentRoute,
  signal?: AbortController['signal'],
) {
  const collectionId = await getCollectionIdFromRouteParam(routeParam);
  return await getInitialCollectionComment(collectionId, signal);
}

export async function getInitialCollectionCommentClubsByRouteParam(
  routeParam: CommentRoute,
  signal?: AbortController['signal'],
) {
  const collectionId = await getCollectionIdFromRouteParam(routeParam);
  return await getInitialCollectionCommentClubs(collectionId, signal);
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

export async function getNFTCommentClubsByRouteParam(
  routeParam: CommentRoute,
  offset: number,
  limit: number,
  version: number,
  signal?: AbortController['signal'],
) {
  const nftId = await getNFTIdFromRouteParam(routeParam);
  return await getNFTCommentClubs(nftId, offset, limit, version, signal);
}

export async function getInitialNFTCommentByRouteParam(routeParam: CommentRoute, signal?: AbortController['signal']) {
  const nftId = await getNFTIdFromRouteParam(routeParam);
  return await getInitialNFTComment(nftId, signal);
}

export async function getInitialNFTCommentClubsByRouteParam(
  routeParam: CommentRoute,
  signal?: AbortController['signal'],
) {
  const nftId = await getNFTIdFromRouteParam(routeParam);
  return await getInitialNFTCommentClubs(nftId, signal);
}

export function initCommentViewState(comment: Comment[]): CommentItem[] {
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
