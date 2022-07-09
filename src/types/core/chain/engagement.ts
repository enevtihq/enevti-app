export type AllLike = {
  address: string[];
};

export type AllLikeAsset = {
  address: Buffer[];
};

export type AllComment = {
  comment: Comment[];
};

export type AllCommentAsset = {
  comment: CommentAsset[];
};

export type Comment = {
  type: 'nft' | 'collection';
  date: number;
  owner: string;
  text: string;
  target: Record<string, unknown>;
};

export interface CommentAsset extends Omit<Comment, 'date' | 'owner' | 'target'> {
  date: bigint;
  owner: Buffer;
  target: Buffer;
}
