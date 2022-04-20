import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import { hp } from 'enevti-app/utils/imageRatio';
import AppNFTListRenderer from 'enevti-app/components/molecules/nft/AppNFTListRenderer';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';

interface AppFeedBodyProps {
  canvasWidth: number;
  feed: FeedItem;
}

export default function AppFeedBody({ canvasWidth, feed }: AppFeedBodyProps) {
  const insets = useSafeAreaInsets();

  return feed.nft.length > 1 ? (
    <AppNFTListRenderer
      nft={feed.nft}
      width={canvasWidth}
      itemWidth={canvasWidth}
    />
  ) : (
    <AppNFTRenderer
      nft={feed.nft[0]}
      width={canvasWidth}
      style={{ marginBottom: hp('1%', insets) }}
    />
  );
}
