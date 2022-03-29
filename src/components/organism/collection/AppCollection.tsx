import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCollection,
  unloadCollection,
} from '../../../store/middleware/thunk/ui/view/collection';
import {
  isCollectionUndefined,
  selectCollectionView,
} from '../../../store/slices/ui/view/collection';
import { FlatList, StyleSheet, View } from 'react-native';
import AppActivityIndicator from '../../../components/atoms/loading/AppActivityIndicator';
import AppCollectionHeader from '../../../components/organism/collection/AppCollectionHeader';
import AppCollectionBody from '../../../components/organism/collection/AppCollectionBody';
import MintedItemsComponent from '../../../components/organism/collection/tabs/MintedItemsComponent';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { HEADER_HEIGHT_PERCENTAGE } from '../../../components/atoms/view/AppHeader';
import { diffClamp } from '../../../utils/animation';
import { COLLECTION_HEADER_VIEW_HEIGHT } from '../../../components/organism/collection/AppCollectionHeader';
import { MINTING_AVAILABLE_VIEW_HEIGHT } from '../../../components/organism/collection/AppCollectionMintingAvailable';
import useDimension from 'enevti-app/utils/hook/useDimension';

interface AppCollectionProps {
  id: string;
}

export default function AppCollection({ id }: AppCollectionProps) {
  const dispatch = useDispatch();
  const { hp } = useDimension();
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE);
  const styles = React.useMemo(() => makeStyles(), []);

  const collection = useSelector(selectCollectionView);
  const collectionUndefined = useSelector(isCollectionUndefined);

  const now = React.useMemo(() => Date.now(), []);
  const mintingAvailable = React.useMemo(
    () =>
      collection.minting.expire <= now || collection.minting.available === 0
        ? false
        : true,
    [collection.minting.expire, collection.minting.available, now],
  );
  const totalHeaderHeight = React.useMemo(
    () =>
      hp(
        COLLECTION_HEADER_VIEW_HEIGHT +
          (mintingAvailable ? MINTING_AVAILABLE_VIEW_HEIGHT : 0),
      ),
    [mintingAvailable, hp],
  );

  const [mintedItemsMounted, setMintedItemsMounted] =
    React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);

  const mintedRef = useAnimatedRef<FlatList>();
  // const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);
  const disableHeaderAnimation = true;

  const onCollectionScreenLoaded = React.useCallback(
    () => dispatch(loadCollection(id)),
    [id, dispatch],
  );

  const onRefresh = React.useCallback(() => {}, []);

  React.useEffect(() => {
    onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(unloadCollection());
    };
  }, [dispatch, onCollectionScreenLoaded]);

  const mintedItemsOnMounted = React.useCallback(
    () => setMintedItemsMounted(true),
    [],
  );

  const activityOnMounted = React.useCallback(
    () => setActivityMounted(true),
    [],
  );

  const useCustomAnimatedScrollHandler = (
    scrollRefList: React.RefObject<any>[],
  ) =>
    useAnimatedScrollHandler({
      onScroll: (event, ctx: { prevY: number; current: number }) => {
        rawScrollY.value = event.contentOffset.y;

        if (event.contentOffset.y < totalHeaderHeight) {
          if (!headerCollapsed.value) {
            headerCollapsed.value = true;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight, false);
            }
          }
        } else {
          if (headerCollapsed.value) {
            headerCollapsed.value = false;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight, false);
            }
          }
        }

        if (event.contentOffset.y < totalHeaderHeight - headerHeight) {
          tabScroll.value = event.contentOffset.y;
          ctx.current = totalHeaderHeight;
        } else {
          if (!disableHeaderAnimation) {
            const diff = event.contentOffset.y - ctx.prevY;
            if (diff > 0 && event.contentOffset.y < totalHeaderHeight) {
              tabScroll.value = event.contentOffset.y;
            } else {
              tabScroll.value = diffClamp(
                ctx.current + diff,
                totalHeaderHeight - headerHeight,
                totalHeaderHeight,
              );
            }
          } else {
            tabScroll.value = totalHeaderHeight - headerHeight;
          }
        }

        // !disableHeaderAnimation &&
        //   onScrollWorklet &&
        //   onScrollWorklet(event.contentOffset.y);
      },
      onBeginDrag: (event, ctx) => {
        ctx.prevY = event.contentOffset.y;
        // !disableHeaderAnimation &&
        //   onBeginDragWorklet &&
        //   onBeginDragWorklet(event.contentOffset.y);
      },
      onEndDrag: (event, ctx) => {
        if (event.contentOffset.y > totalHeaderHeight) {
          if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
            if (!disableHeaderAnimation) {
              tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
                duration: 200,
              });
            }
            ctx.current = totalHeaderHeight - headerHeight;
          } else {
            tabScroll.value = withTiming(totalHeaderHeight, {
              duration: 200,
            });
            ctx.current = totalHeaderHeight;
          }
        } else {
          for (let i = 0; i < scrollRefList.length; i++) {
            scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
          }
        }
        // !disableHeaderAnimation &&
        //   onEndDragWorklet &&
        //   onEndDragWorklet(event.contentOffset.y);
      },
      onMomentumEnd: (event, ctx) => {
        if (event.contentOffset.y > totalHeaderHeight) {
          if (tabScroll.value < totalHeaderHeight - headerHeight / 2) {
            if (!disableHeaderAnimation) {
              tabScroll.value = withTiming(totalHeaderHeight - headerHeight, {
                duration: 200,
              });
            }
            ctx.current = totalHeaderHeight - headerHeight;
          } else {
            tabScroll.value = withTiming(totalHeaderHeight, {
              duration: 200,
            });
            ctx.current = totalHeaderHeight;
          }
        } else {
          for (let i = 0; i < scrollRefList.length; i++) {
            scrollTo(scrollRefList[i], 0, event.contentOffset.y, false);
          }
        }
        // !disableHeaderAnimation &&
        //   onMomentumEndWorklet &&
        //   onMomentumEndWorklet(event.contentOffset.y);
      },
    });

  const mintedItemsScrollHandler = useCustomAnimatedScrollHandler([]);

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -rawScrollY.value }],
    };
  });

  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -tabScroll.value }],
    };
  });

  const scrollEnabled = React.useMemo(
    () => (mintedItemsMounted ? true : false),
    [mintedItemsMounted],
  );

  const MintedItemsScreen = React.useCallback(
    () => (
      <MintedItemsComponent
        ref={mintedRef}
        nfts={collection.minted}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={mintedItemsScrollHandler}
        onMounted={mintedItemsOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      collection.minted,
      totalHeaderHeight,
      mintedItemsOnMounted,
      mintedItemsScrollHandler,
      mintedRef,
      onRefresh,
      scrollEnabled,
    ],
  );

  return !collectionUndefined ? (
    <View style={styles.collectionContainer}>
      <Animated.View style={[styles.collectionHeader, scrollStyle]}>
        <AppCollectionHeader
          collection={collection}
          mintingAvailable={mintingAvailable}
        />
      </Animated.View>
      <AppCollectionBody
        collectionHeaderHeight={totalHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        mintedItemsScreen={MintedItemsScreen}
        activityScreen={MintedItemsScreen}
      />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    collectionContainer: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    collectionHeader: {
      position: 'absolute',
      zIndex: 2,
    },
  });
