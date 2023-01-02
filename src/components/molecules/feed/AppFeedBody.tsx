import React from 'react';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import AppNFTListRenderer from 'enevti-app/components/molecules/nft/AppNFTListRenderer';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppFeedBodyProps {
  canvasWidth: number;
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppFeedBody({ canvasWidth, navigation, feed }: AppFeedBodyProps) {
  const dnavigation = useDebouncedNavigation(navigation);

  const onPress = React.useCallback(() => {
    dnavigation('Collection', { arg: feed.id, mode: 'id' });
  }, [feed.id, dnavigation]);

  return feed.nft.length > 1 ? (
    <AppNFTListRenderer
      lazy
      imageSize={'l'}
      nft={feed.nft}
      width={canvasWidth}
      itemWidth={canvasWidth}
      onPress={onPress}
    />
  ) : (
    <AppNFTRenderer
      lazy
      imageSize={'l'}
      nft={feed.nft[0]}
      width={canvasWidth}
      style={{ marginBottom: hp('1%') }}
      onPress={onPress}
    />
  );
}
