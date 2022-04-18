import React from 'react';
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import AppView from 'enevti-app/components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppRecentMoments from 'enevti-app/components/organism/AppRecentMoments';
import AppFeedItem from 'enevti-app/components/molecules/feed/AppFeedItem';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { handleError } from 'enevti-app/utils/error/handle';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadFeeds,
  unloadFeeds,
} from 'enevti-app/store/middleware/thunk/ui/view/feed';
import {
  loadMoments,
  unloadMoments,
} from 'enevti-app/store/middleware/thunk/ui/view/moment';
import { AppAsyncThunk } from 'enevti-app/types/store/AppAsyncThunk';
import {
  isFeedUndefined,
  selectFeedView,
} from 'enevti-app/store/slices/ui/view/feed';
import {
  isMomentUndefined,
  selectMomentView,
} from 'enevti-app/store/slices/ui/view/moment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

interface FeedProps extends Props {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight: number;
}

export default function Feed({
  navigation,
  onScroll,
  headerHeight,
}: FeedProps) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(headerHeight), [headerHeight]);
  const insets = useSafeAreaInsets();
  const feedHeight = hp('24%', insets) + wp('95%', insets);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const feedRef = useAnimatedRef<FlatList>();

  const feeds = useSelector(selectFeedView);
  const feedsUndefined = useSelector(isFeedUndefined);
  const moments = useSelector(selectMomentView);
  const momentsUndefined = useSelector(isMomentUndefined);

  const handleLoadMoment = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadMoments({ reload }));
    },
    [dispatch],
  ) as AppAsyncThunk;

  const handleLoadFeed = React.useCallback(
    (reload: boolean = false) => {
      return dispatch(loadFeeds({ reload }));
    },
    [dispatch],
  ) as AppAsyncThunk;

  const onLoaded = React.useCallback(
    async (reload: boolean = false) => {
      setRefreshing(true);
      await handleLoadFeed(reload).unwrap();
      await handleLoadMoment(reload).unwrap();
      feedRef.current?.scrollToOffset({ offset: 1 });
      setRefreshing(false);
    },
    [handleLoadFeed, handleLoadMoment, feedRef],
  );

  React.useEffect(() => {
    onLoaded();
    return function cleanup() {
      dispatch(unloadMoments());
      dispatch(unloadFeeds());
    };
  }, [onLoaded, dispatch]);

  const handleRefresh = async () => {
    try {
      onLoaded(true);
    } catch (err: any) {
      handleError(err);
    }
  };

  const ListHeaderComponent = React.useCallback(
    () => <AppRecentMoments moments={moments} isUndefined={momentsUndefined} />,
    [moments, momentsUndefined],
  );

  const renderItem = React.useCallback(
    ({ item }: any) => <AppFeedItem feed={item} navigation={navigation} />,
    [navigation],
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
    <AppView darken withLoader>
      <View style={styles.textContainer}>
        {!feedsUndefined ? (
          <AnimatedFlatList
            ref={feedRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            data={feeds}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={11}
            getItemLayout={getItemLayout}
            contentContainerStyle={styles.listContentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                progressViewOffset={headerHeight}
              />
            }
          />
        ) : (
          <View style={styles.loaderContainer}>
            <AppActivityIndicator animating />
          </View>
        )}
      </View>
    </AppView>
  );
}

const makeStyles = (headerHeight: number) =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
    listContentContainer: {
      paddingTop: headerHeight,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
