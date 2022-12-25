import React from 'react';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import AppNFTListRenderer from 'enevti-app/components/molecules/nft/AppNFTListRenderer';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppFeedBodyProps {
  canvasWidth: number;
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppFeedBody({ canvasWidth, navigation, feed }: AppFeedBodyProps) {
  const onPress = React.useCallback(() => {
    navigation.push('Collection', { arg: feed.id, mode: 'id' });
  }, [feed.id, navigation]);

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
