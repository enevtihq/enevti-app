import { Persona } from '../account/persona';

export type LikeAt = {
  address: string[];
};

export type LikeAtAsset = {
  address: Buffer[];
};

export type CommentAt = {
  comment: Comment[];
};

export type CommentAtAsset = {
  comment: Buffer[];
};

export type ReplyAt = {
  reply: Reply[];
};

export type ReplyAtAsset = {
  reply: Buffer[];
};

export type Liked = {
  status: 0 | 1;
};

export type LikedAsset = Liked;

export type Comment = {
  id: string;
  type: 'nft' | 'collection';
  date: number;
  owner: Persona;
  text: string;
  target: string;
  reply: number;
  like: number;
  liked: boolean;
};

export interface CommentAsset extends Omit<Comment, 'id' | 'date' | 'owner' | 'target' | 'liked'> {
  id: Buffer;
  date: bigint;
  owner: Buffer;
  target: Buffer;
}

export type Reply = Omit<Comment, 'type' | 'reply'>;

export type ReplyAsset = Omit<CommentAsset, 'type' | 'reply'>;
