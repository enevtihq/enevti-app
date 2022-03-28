import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import AppView from '../../components/atoms/view/AppView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  resetStatusBarBackground,
  setStatusBarBackground,
} from '../../store/slices/ui/global/statusbar';
import { RootStackParamList } from '../../navigation';
import {
  loadCollection,
  unloadCollection,
} from '../../store/middleware/thunk/ui/view/collection';
import {
  isCollectionUndefined,
  selectCollectionView,
} from '../../store/slices/ui/view/collection';
import { FlatList, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import AppActivityIndicator from '../../components/atoms/loading/AppActivityIndicator';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../theme/default';
import AppCollectionHeader from '../../components/organism/collection/AppCollectionHeader';
import AppCollectionBody from '../../components/organism/collection/AppCollectionBody';
import MintedItemsComponent from '../../components/organism/collection/tabs/MintedItemsComponent';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { HEADER_HEIGHT_PERCENTAGE } from '../../components/atoms/view/AppHeader';
import { hp } from '../../utils/imageRatio';
import { diffClamp } from '../../utils/animation';

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ route }: Props) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const styles = React.useMemo(() => makeStyles(), []);

  const [mintedItemsMounted, setMintedItemsMounted] =
    React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);
  const [collectionHeaderHeight, setCollectionHeaderHeight] =
    React.useState<number>(0);

  const mintedRef = useAnimatedRef<FlatList>();
  // const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);
  const totalHeaderHeight = React.useMemo(
    () => collectionHeaderHeight,
    [collectionHeaderHeight],
  );
  const disableHeaderAnimation = true;

  const collection = useSelector(selectCollectionView);
  const collectionUndefined = useSelector(isCollectionUndefined);

  const onCollectionHeaderLayout = React.useCallback((e: LayoutChangeEvent) => {
    setCollectionHeaderHeight(e.nativeEvent.layout.height);
  }, []);

  const onCollectionScreenLoaded = React.useCallback(
    () => dispatch(loadCollection(id)),
    [id, dispatch],
  );

  const onRefresh = React.useCallback(() => {}, []);

  React.useEffect(() => {
    dispatch(setStatusBarBackground('transparent'));
    onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(resetStatusBarBackground());
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
        collectionHeaderHeight={collectionHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={mintedItemsScrollHandler}
        onMounted={mintedItemsOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      collection.minted,
      collectionHeaderHeight,
      mintedItemsOnMounted,
      mintedItemsScrollHandler,
      mintedRef,
      onRefresh,
      scrollEnabled,
    ],
  );

  return !collectionUndefined ? (
    <AppView darken translucentStatusBar edges={['bottom', 'left', 'right']}>
      <Animated.View style={[styles.collectionHeader, scrollStyle]}>
        <AppCollectionHeader
          collection={collection}
          onLayout={onCollectionHeaderLayout}
        />
      </Animated.View>
      <AppCollectionBody
        collectionHeaderHeight={collectionHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        mintedItemsScreen={MintedItemsScreen}
        activityScreen={MintedItemsScreen}
      />
    </AppView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
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
