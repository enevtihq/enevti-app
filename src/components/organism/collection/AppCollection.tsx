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
import { hideModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import { RootState } from 'enevti-app/store/state';
import { RouteProp } from '@react-navigation/native';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import AppResponseView from '../view/AppResponseView';
import { STATUS_BAR_HEIGHT } from 'enevti-app/components/atoms/view/AppStatusBar';

const noDisplay = 'none';
const visible = 1;
const notVisible = 0;

interface AppCollectionProps {
  onScrollWorklet: (val: number) => void;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Collection'>;
}

export default function AppCollection({ onScrollWorklet, navigation, route }: AppCollectionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE) + insets.top;

  const collection = useSelector((state: RootState) =>
    selectCollectionView(state, route.params.arg),
  );
  const collectionUndefined = useSelector((state: RootState) =>
    isCollectionUndefined(state, route.params.arg),
  );

  const now = React.useMemo(() => Date.now(), []);
  const mintingAvailable = React.useMemo(
    () =>
      collection.reqStatus === 200
        ? collection.minting.expire <= now || collection.minting.available === 0
          ? false
          : true
        : false,
    [collection, now],
  );
  const headerPercentage = React.useMemo(
    () => COLLECTION_HEADER_VIEW_HEIGHT + (mintingAvailable ? MINTING_AVAILABLE_VIEW_HEIGHT : 0),
    [mintingAvailable],
  );
  const totalHeaderHeight = React.useMemo(() => hp(headerPercentage), [hp, headerPercentage]);
  const styles = React.useMemo(
    () => makeStyles(hp, wp, headerPercentage),
    [hp, wp, headerPercentage],
  );

  const [mintedItemsMounted, setMintedItemsMounted] = React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);

  const mintedRef = useAnimatedRef<FlatList>();
  const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const onCollectionScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadCollection({ routeParam: route.params, reload })),
    [dispatch, route.params],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(() => {
    onCollectionScreenLoaded(true);
    mintedRef.current?.scrollToOffset({ offset: 0 });
    activityRef.current?.scrollToOffset({ offset: 0 });
    onScrollWorklet && onScrollWorklet(0);
  }, [onCollectionScreenLoaded, mintedRef, activityRef, onScrollWorklet]);

  React.useEffect(() => {
    const promise = onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(unloadCollection(route.params.arg));
      promise.abort();
    };
  }, [dispatch, onCollectionScreenLoaded, route.params.arg]);

  const mintedItemsOnMounted = React.useCallback(() => setMintedItemsMounted(true), []);

  const activityOnMounted = React.useCallback(() => setActivityMounted(true), []);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
  }, [dispatch, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const useCustomAnimatedScrollHandler = (scrollRefList: React.RefObject<any>[]) =>
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

  const mintedItemsScrollHandler = useCustomAnimatedScrollHandler([activityRef]);
  const collectionActivityScrollHandler = useCustomAnimatedScrollHandler([mintedRef]);

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

  const progressViewOffset = React.useMemo(
    () => hp(HEADER_HEIGHT_PERCENTAGE + STATUS_BAR_HEIGHT()),
    [hp],
  );

  return !collectionUndefined ? (
    <AppResponseView
      onReload={onRefresh}
      progressViewOffset={progressViewOffset}
      status={collection.reqStatus}
      style={styles.collectionContainer}>
      <Animated.View pointerEvents={'box-none'} style={[styles.collectionHeader, scrollStyle]}>
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
        style={{
          opacity: scrollEnabled ? visible : notVisible,
        }}
      />
      {scrollEnabled ? null : (
        <AppActivityIndicator
          animating={true}
          style={[styles.mountedIndicator, { display: scrollEnabled ? noDisplay : undefined }]}
          color={theme.colors.primary}
        />
      )}
      <AppCollectionMintButton collection={collection} mintingAvailable={mintingAvailable} />
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (hp: DimensionFunction, wp: DimensionFunction, headerPercentage: number) =>
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
    mountedIndicator: {
      position: 'absolute',
      top: hp(headerPercentage + 15),
      left: wp('48%'),
    },
  });
