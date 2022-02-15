import React from 'react';
import { HomeFeedItemResponse } from '../../../types/service/homeFeedItem';
import AppNFTListRenderer from '../nft/AppNFTListRenderer';
import AppNFTRenderer from '../nft/AppNFTRenderer';

interface AppFeedBodyProps {
  canvasWidth: number;
  feed: HomeFeedItemResponse;
}

export default function AppFeedBody({ canvasWidth, feed }: AppFeedBodyProps) {
  return feed.nft.length > 1 ? (
    <AppNFTListRenderer
      nft={feed.nft}
      width={canvasWidth}
      itemWidth={canvasWidth}
    />
  ) : (
    <AppNFTRenderer nft={feed.nft[0]} width={canvasWidth} />
  );
}
