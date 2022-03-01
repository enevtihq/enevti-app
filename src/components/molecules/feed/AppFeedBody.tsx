import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedItem } from '../../../types/service/enevti/feed';
import { hp } from '../../../utils/imageRatio';
import AppNFTListRenderer from '../nft/AppNFTListRenderer';
import AppNFTRenderer from '../nft/AppNFTRenderer';

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
