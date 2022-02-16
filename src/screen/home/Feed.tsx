import React from 'react';
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
} from '../../types/service/homeFeedItem';
import { getHomeFeedList, getHomeMomentsList } from '../../service/enevti/home';
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
}

export default function Feed({ onScroll }: FeedProps) {
  const styles = makeStyle();
  const insets = useSafeAreaInsets();
  const feedHeight = hp('24%', insets) + wp('95%', insets);

  const [feedItem, setFeedItem] = React.useState<HomeFeedResponse>();
  const [momentsItem, setMomentsItem] = React.useState<HomeMomentsResponse>();

  const loadHome = async () => {
    try {
      const feed = await getHomeFeedList();
      const moments = await getHomeMomentsList();
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
    loadHome();
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
    <AppView darken={true}>
      <View style={styles.textContainer}>
        <AnimatedFlatList
          onScroll={onScroll}
          scrollEventThrottle={16}
          data={feedItem}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          getItemLayout={getItemLayout}
        />
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
    shadowProp: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
  });
