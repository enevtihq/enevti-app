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
import AppRecentMoments from 'enevti-app/components/organism/moment/AppRecentMoments';
import AppFeedItem from 'enevti-app/components/molecules/feed/AppFeedItem';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { handleError } from 'enevti-app/utils/error/handle';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { useDispatch, useSelector } from 'react-redux';
import { loadFeeds, loadMoreFeeds } from 'enevti-app/store/middleware/thunk/ui/view/feed';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import {
  isFeedUndefined,
  isThereAnyNewFeedView,
  selectFeedView,
  selectFeedViewReqStatus,
  setFeedViewVersion,
} from 'enevti-app/store/slices/ui/view/feed';
import { isThereAnyNewRecentMoment, selectRecentMoment } from 'enevti-app/store/slices/ui/view/recentMoment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppResponseView from 'enevti-app/components/organism/view/AppResponseView';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';
import { useTranslation } from 'react-i18next';
import { store } from 'enevti-app/store/state';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

interface FeedProps extends Props {
  headerHeight: number;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const onLoadFeed = (reload: boolean = false) => {
  return store.dispatch(loadFeeds({ reload }) as unknown as AppAsyncThunk);
};

export default function Feed({ navigation, onScroll, headerHeight }: FeedProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(headerHeight), [headerHeight]);
  const feedHeight = hp('24%') + wp('95%');
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const feedRef = useAnimatedRef<FlatList>();
  const isOnTopRef = React.useRef<boolean>(false);
  const newUpdateRef = React.useRef<boolean>(false);

  const feeds = useSelector(selectFeedView);
  const feedsUndefined = useSelector(isFeedUndefined);
  const newFeeds = useSelector(isThereAnyNewFeedView);
  const feedsReqStatus = useSelector(selectFeedViewReqStatus);
  const moments = useSelector(selectRecentMoment);
  const newMoments = useSelector(isThereAnyNewRecentMoment);

  const handleLoadFeed = React.useCallback((reload: boolean = false) => {
    return onLoadFeed(reload);
  }, []);

  const handleUpdateClosed = React.useCallback(() => {
    dispatch(setFeedViewVersion(Date.now()));
  }, [dispatch]);

  const handleUpdateRef = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y > hp(80)) {
      isOnTopRef.current = false;
    } else {
      isOnTopRef.current = true;
    }
  }, []);

  const onLoaded = React.useCallback(
    async (reload: boolean = false) => {
      setRefreshing(true);
      await handleLoadFeed(reload).unwrap();
      reload && feedRef.current?.scrollToOffset({ offset: 0 });
      setRefreshing(false);
    },
    [handleLoadFeed, feedRef],
  );

  const handleRefresh = React.useCallback(async () => {
    try {
      onLoaded(true);
    } catch (err: any) {
      handleError(err);
    }
  }, [onLoaded]);

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreFeeds());
  }, [dispatch]);

  React.useEffect(() => {
    onLoaded(true);
  }, [onLoaded, dispatch]);

  const ListHeaderComponent = React.useMemo(() => <AppRecentMoments navigation={navigation} />, [navigation]);

  const ListFooterComponent = React.useMemo(() => <View style={{ height: hp(10) }} />, []);

  const renderItem = React.useCallback(
    ({ item, index }: any) => <AppFeedItem feed={item} navigation={navigation} index={index} />,
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

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} progressViewOffset={headerHeight} />,
    [refreshing, handleRefresh, headerHeight],
  );

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const contentContainerStyle = React.useMemo(
    () =>
      (feeds && feeds.length > 0) || (moments && moments.length > 0)
        ? styles.listContentContainer
        : styles.listContentEmptyContainer,
    [feeds, moments, styles.listContentContainer, styles.listContentEmptyContainer],
  );

  const newUpdate = React.useMemo(() => newFeeds || newMoments, [newFeeds, newMoments]);

  useFocusEffect(
    React.useCallback(() => {
      if (newUpdateRef.current && isOnTopRef.current) {
        handleRefresh();
      }
    }, [handleRefresh]),
  );

  React.useEffect(() => {
    newUpdateRef.current = newUpdate;
  }, [newUpdate]);

  return (
    <AppView darken withLoader withPaymentOnly navigation={navigation}>
      <View style={styles.textContainer}>
        {!feedsUndefined ? (
          <AppResponseView
            onReload={handleRefresh}
            status={feedsReqStatus}
            refreshing={refreshing}
            style={styles.textContainer}
            progressViewOffset={headerHeight}>
            <AppFloatingNotifButton
              show={newUpdate}
              label={t('home:newFeedUpdate')}
              onPress={handleRefresh}
              style={{ top: headerHeight + hp('2%') }}
              onClose={handleUpdateClosed}
            />
            <AnimatedFlatList
              ref={feedRef}
              onScroll={onScroll}
              onMomentumScrollBegin={handleUpdateClosed}
              onMomentumScrollEnd={handleUpdateRef}
              scrollEventThrottle={16}
              data={feeds}
              ListHeaderComponent={ListHeaderComponent}
              ListFooterComponent={ListFooterComponent}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              removeClippedSubviews={true}
              initialNumToRender={6}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              windowSize={11}
              getItemLayout={getItemLayout}
              contentContainerStyle={contentContainerStyle}
              ListEmptyComponent={emptyComponent}
              refreshControl={refreshControl}
              onEndReachedThreshold={0.1}
              onEndReached={handleLoadMore}
            />
          </AppResponseView>
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
    listContentEmptyContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  });
