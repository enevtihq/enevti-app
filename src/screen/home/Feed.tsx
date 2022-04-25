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
import { loadFeeds, unloadFeeds } from 'enevti-app/store/middleware/thunk/ui/view/feed';
import { loadMoments, unloadMoments } from 'enevti-app/store/middleware/thunk/ui/view/moment';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { isFeedUndefined, selectFeedView } from 'enevti-app/store/slices/ui/view/feed';
import { isMomentUndefined, selectMomentView } from 'enevti-app/store/slices/ui/view/moment';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppInfoMessage from 'enevti-app/components/molecules/AppInfoMessage';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

interface FeedProps extends Props {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerHeight: number;
}

export default function Feed({ navigation, onScroll, headerHeight }: FeedProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
      reload && feedRef.current?.scrollToOffset({ offset: 0 });
      setRefreshing(false);
    },
    [handleLoadFeed, handleLoadMoment, feedRef],
  );

  const handleRefresh = React.useCallback(async () => {
    try {
      onLoaded(true);
    } catch (err: any) {
      handleError(err);
    }
  }, [onLoaded]);

  React.useEffect(() => {
    onLoaded();
    return function cleanup() {
      dispatch(unloadMoments());
      dispatch(unloadFeeds());
    };
  }, [onLoaded, dispatch]);

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

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        progressViewOffset={headerHeight}
      />
    ),
    [refreshing, handleRefresh, headerHeight],
  );

  const emptyComponent = React.useMemo(
    () => <AppInfoMessage icon={iconMap.empty} message={t('error:noData')} />,
    [t],
  );

  const contentContainerStyle = React.useMemo(
    () =>
      feeds.length > 0 || moments.length > 0
        ? styles.listContentContainer
        : styles.listContentEmptyContainer,
    [feeds.length, moments.length, styles.listContentContainer, styles.listContentEmptyContainer],
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
