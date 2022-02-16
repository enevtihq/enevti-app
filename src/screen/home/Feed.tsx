import React from 'react';
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import AppView from '../../components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppRecentMoments from '../../components/organism/AppRecentMoments';
import AppFeedItem from '../../components/molecules/AppFeedItem';
import {
  HomeFeedResponse,
  HomeFeedItemResponse,
  HomeMomentsResponse,
} from '../../types/service/enevti/feed';
import { getFeedList, getMomentsList } from '../../service/enevti/feed';
import Animated from 'react-native-reanimated';
import { handleError } from '../../utils/errorHandling';
import { hp, wp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<HomeFeedItemResponse>>(
    FlatList,
  );

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

interface FeedProps extends Props {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight: number;
}

export default function Feed({ onScroll, headerHeight }: FeedProps) {
  const styles = makeStyle(headerHeight);
  const insets = useSafeAreaInsets();
  const feedHeight = hp('24%', insets) + wp('95%', insets);

  const [feedItem, setFeedItem] = React.useState<HomeFeedResponse>();
  const [momentsItem, setMomentsItem] = React.useState<HomeMomentsResponse>();
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onFeedScreenLoaded();
    setRefreshing(false);
  };

  const onFeedScreenLoaded = async () => {
    try {
      const feed = await getFeedList();
      const moments = await getMomentsList();
      if (feed) {
        setFeedItem(feed);
      }
      if (moments) {
        setMomentsItem(moments);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  React.useEffect(() => {
    onFeedScreenLoaded();
  }, []);

  const ListHeaderComponent = React.useCallback(
    () => <AppRecentMoments moments={momentsItem} />,
    [momentsItem],
  );

  const renderItem = React.useCallback(
    ({ item }: any) => <AppFeedItem feed={item} />,
    [],
  );

  const keyExtractor = React.useCallback(item => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: feedHeight,
      offset: feedHeight * index,
      index,
    }),
    [feedHeight],
  );

  return (
    <AppView
      darken={true}
      edges={Platform.OS === 'ios' ? ['bottom', 'left', 'right'] : undefined}>
      <View style={styles.textContainer}>
        <AnimatedFlatList
          onScroll={onScroll}
          scrollEventThrottle={16}
          data={feedItem}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContentContainer}
          contentInset={{ top: headerHeight }}
          contentOffset={{ y: Platform.OS === 'ios' ? -headerHeight : 0, x: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              progressViewOffset={headerHeight}
            />
          }
        />
      </View>
    </AppView>
  );
}

const makeStyle = (headerHeight: number) =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
    listContentContainer: {
      paddingTop: Platform.OS === 'android' ? headerHeight : 0,
    },
  });
