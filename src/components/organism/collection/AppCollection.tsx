import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCollection,
  unloadCollection,
} from 'enevti-app/store/middleware/thunk/ui/view/collection';
import {
  isCollectionUndefined,
  selectCollectionView,
} from 'enevti-app/store/slices/ui/view/collection';
import { FlatList, StyleSheet, View } from 'react-native';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppCollectionHeader from 'enevti-app/components/organism/collection/AppCollectionHeader';
import AppCollectionBody from 'enevti-app/components/organism/collection/AppCollectionBody';
import MintedItemsComponent from 'enevti-app/components/organism/collection/tabs/MintedItemsComponent';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { COLLECTION_HEADER_VIEW_HEIGHT } from 'enevti-app/components/organism/collection/AppCollectionHeader';
import { MINTING_AVAILABLE_VIEW_HEIGHT } from 'enevti-app/components/organism/collection/AppCollectionMintingAvailable';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CollectionActivityComponent from './tabs/CollectionActivityComponent';
import AppCollectionMintButton from './AppCollectionMintButton';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { AppAsyncThunk } from 'enevti-app/types/store/AppAsyncThunk';

interface AppCollectionProps {
  id: string;
  onScrollWorklet: (val: number) => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppCollection({
  id,
  onScrollWorklet,
  navigation,
}: AppCollectionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hp } = useDimension();
  const insets = useSafeAreaInsets();
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE) + insets.top;
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
  const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);
  const disableHeaderAnimation = true;

  const onCollectionScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadCollection({ id, reload })),
    [id, dispatch],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(() => {
    onCollectionScreenLoaded(true);
    mintedRef.current?.scrollToOffset({ offset: 1 });
    activityRef.current?.scrollToOffset({ offset: 1 });
    onScrollWorklet && onScrollWorklet(0);
  }, [onCollectionScreenLoaded, mintedRef, activityRef, onScrollWorklet]);

  React.useEffect(() => {
    const promise = onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(unloadCollection());
      promise.abort();
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

  const paymentProcessCallback = React.useCallback(() => {
    dispatch(showModalLoader());
  }, [dispatch]);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
  }, [dispatch, t]);

  const paymentErrorCallback = React.useCallback(
    () => dispatch(hideModalLoader()),
    [dispatch],
  );

  usePaymentCallback({
    onProcess: paymentProcessCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

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
          tabScroll.value = totalHeaderHeight - headerHeight;
        }

        onScrollWorklet(event.contentOffset.y);
      },
      onBeginDrag: (event, ctx) => {
        ctx.prevY = event.contentOffset.y;
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
      },
    });

  const mintedItemsScrollHandler = useCustomAnimatedScrollHandler([
    activityRef,
  ]);
  const collectionActivityScrollHandler = useCustomAnimatedScrollHandler([
    mintedRef,
  ]);

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
    () => (mintedItemsMounted && activityMounted ? true : false),
    [mintedItemsMounted, activityMounted],
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
        mintingAvailable={mintingAvailable}
        navigation={navigation}
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
      mintingAvailable,
      navigation,
    ],
  );

  const ActivityScreen = React.useCallback(
    () => (
      <CollectionActivityComponent
        ref={activityRef}
        activities={collection.activity}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={collectionActivityScrollHandler}
        onMounted={activityOnMounted}
        onRefresh={onRefresh}
        mintingAvailable={mintingAvailable}
      />
    ),
    [
      activityOnMounted,
      activityRef,
      collection.activity,
      collectionActivityScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
      mintingAvailable,
    ],
  );

  return !collectionUndefined ? (
    <View style={styles.collectionContainer}>
      <Animated.View
        pointerEvents={'box-none'}
        style={[styles.collectionHeader, scrollStyle]}>
        <AppCollectionHeader
          navigation={navigation}
          collection={collection}
          mintingAvailable={mintingAvailable}
          onFinish={onRefresh}
        />
      </Animated.View>
      <AppCollectionBody
        collectionHeaderHeight={totalHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        mintedItemsScreen={MintedItemsScreen}
        activityScreen={ActivityScreen}
      />
      <AppCollectionMintButton
        collection={collection}
        mintingAvailable={mintingAvailable}
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
