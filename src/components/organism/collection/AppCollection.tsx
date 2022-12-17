import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCollection, unloadCollection } from 'enevti-app/store/middleware/thunk/ui/view/collection';
import {
  isCollectionUndefined,
  isThereAnyNewCollectionUpdates,
  selectCollectionView,
  setCollectionViewVersion,
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
import { DimensionFunction } from 'enevti-app/utils/layout/imageRatio';
import { useTheme } from 'react-native-paper';
import AppResponseView from '../view/AppResponseView';
import { STATUS_BAR_HEIGHT } from 'enevti-app/components/atoms/view/AppStatusBar';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/app/network';
import { reduceNewNTotalMinted } from 'enevti-app/store/middleware/thunk/socket/collection/newTotalMinted';
import { reduceNewCollectionUpdates } from 'enevti-app/store/middleware/thunk/socket/collection/newCollectionUpdates';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';
import { isMintingAvailable } from 'enevti-app/utils/collection';
import AppAlertModal from '../menu/AppAlertModal';
import {
  hideOnceLike,
  selectOnceLike,
  selectOnceLikeShow,
  touchOnceLike,
} from 'enevti-app/store/slices/entities/once/like';
import { reduceNewCollectionLike } from 'enevti-app/store/middleware/thunk/socket/collection/newLike';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import MomentCreatedListComponent from './tabs/MomentCreatedListComponent';

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

  const onceLike = useSelector(selectOnceLike);
  const onceLikeShow = useSelector(selectOnceLikeShow);
  const collection = useSelector((state: RootState) => selectCollectionView(state, route.key));
  const collectionUndefined = useSelector((state: RootState) => isCollectionUndefined(state, route.key));
  const newUpdate = useSelector((state: RootState) => isThereAnyNewCollectionUpdates(state, route.key));
  const socket = React.useRef<Socket | undefined>();

  const onUpdateClose = React.useCallback(() => {
    dispatch(setCollectionViewVersion({ key: route.key, value: Date.now() }));
  }, [dispatch, route.key]);

  React.useEffect(() => {
    if (collection.loaded && collection.id) {
      const key = route.key;
      socket.current = appSocket(collection.id);
      socket.current.on('newCollectionUpdates', (payload: any) => dispatch(reduceNewCollectionUpdates(payload, key)));
      socket.current.on('newTotalMinted', (payload: any) => dispatch(reduceNewNTotalMinted(payload, key)));
      socket.current.on('newLike', (payload: any) => dispatch(reduceNewCollectionLike(payload, key)));
      return function cleanup() {
        socket.current?.disconnect();
      };
    }
  }, [collection, dispatch, route.key]);

  const mintingAvailable = React.useMemo(
    () => (collection.reqStatus === 200 ? (isMintingAvailable(collection) ? true : false) : false),
    [collection],
  );
  const headerPercentage = React.useMemo(
    () => COLLECTION_HEADER_VIEW_HEIGHT + (mintingAvailable ? MINTING_AVAILABLE_VIEW_HEIGHT : 0),
    [mintingAvailable],
  );
  const totalHeaderHeight = React.useMemo(() => hp(headerPercentage), [hp, headerPercentage]);
  const styles = React.useMemo(() => makeStyles(hp, wp, headerPercentage), [hp, wp, headerPercentage]);

  const [mintedItemsMounted, setMintedItemsMounted] = React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);
  const [momentMounted, setMomentMounted] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, afterRefresh] = React.useState<boolean>(false);

  const mintedRef = useAnimatedRef<FlatList>();
  const activityRef = useAnimatedRef<FlatList>();
  const momentRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const onCollectionScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadCollection({ route, reload })),
    [dispatch, route],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(async () => {
    afterRefresh(false); // ios after refresh fix
    mintedRef.current?.scrollToOffset({ offset: 0 });
    activityRef.current?.scrollToOffset({ offset: 0 });
    momentRef.current?.scrollToOffset({ offset: 0 });
    onScrollWorklet && onScrollWorklet(0);
    await onCollectionScreenLoaded(true).unwrap();
    afterRefresh(true); // ios after refresh fix
  }, [mintedRef, activityRef, momentRef, onScrollWorklet, onCollectionScreenLoaded]);

  React.useEffect(() => {
    const promise = onCollectionScreenLoaded();
    return function cleanup() {
      dispatch(unloadCollection(route.key));
      promise.abort();
    };
  }, [dispatch, onCollectionScreenLoaded, route.key]);

  const mintedItemsOnMounted = React.useCallback(() => setMintedItemsMounted(true), []);

  const activityOnMounted = React.useCallback(() => setActivityMounted(true), []);

  const momentOnMounted = React.useCallback(() => setMomentMounted(true), []);

  const onceLikeOnDismiss = React.useCallback(() => {
    dispatch(touchOnceLike());
    dispatch(hideOnceLike());
  }, [dispatch]);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['mintCollection', 'mintCollectionByQR'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
  }, [dispatch, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    condition: paymentCondition,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  const useCustomAnimatedScrollHandler = (scrollRefList: React.RefObject<any>[]) =>
    useAnimatedScrollHandler({
      onScroll: (event, ctx: { prevY: number; current: number }) => {
        rawScrollY.value = event.contentOffset.y;

        if (event.contentOffset.y < totalHeaderHeight - headerHeight) {
          if (!headerCollapsed.value) {
            headerCollapsed.value = true;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight - headerHeight, false);
            }
          }
        } else {
          if (headerCollapsed.value) {
            headerCollapsed.value = false;
            for (let i = 0; i < scrollRefList.length; i++) {
              scrollTo(scrollRefList[i], 0, totalHeaderHeight - headerHeight, false);
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

  const mintedItemsScrollHandler = useCustomAnimatedScrollHandler([activityRef, momentRef]);
  const collectionActivityScrollHandler = useCustomAnimatedScrollHandler([mintedRef, momentRef]);
  const collectionMomentScrollHandler = useCustomAnimatedScrollHandler([activityRef, mintedRef]);

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
    () => (mintedItemsMounted && activityMounted && momentMounted ? true : false),
    [mintedItemsMounted, activityMounted, momentMounted],
  );

  const MintedItemsScreen = React.useCallback(
    () => (
      <MintedItemsComponent
        ref={mintedRef}
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={mintedItemsScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={mintedItemsOnMounted}
        onRefresh={onRefresh}
        mintingAvailable={mintingAvailable}
        navigation={navigation}
      />
    ),
    [
      route,
      totalHeaderHeight,
      onUpdateClose,
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
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={collectionActivityScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={activityOnMounted}
        onRefresh={onRefresh}
        mintingAvailable={mintingAvailable}
      />
    ),
    [
      activityOnMounted,
      onUpdateClose,
      activityRef,
      route,
      collectionActivityScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
      mintingAvailable,
    ],
  );

  const MomentScreen = React.useCallback(
    () => (
      <MomentCreatedListComponent
        ref={momentRef}
        navigation={navigation}
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={collectionMomentScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={momentOnMounted}
        onRefresh={onRefresh}
        mintingAvailable={mintingAvailable}
      />
    ),
    [
      momentRef,
      navigation,
      route,
      totalHeaderHeight,
      scrollEnabled,
      collectionMomentScrollHandler,
      onUpdateClose,
      momentOnMounted,
      onRefresh,
      mintingAvailable,
    ],
  );

  const progressViewOffset = React.useMemo(() => hp(HEADER_HEIGHT_PERCENTAGE + STATUS_BAR_HEIGHT()), [hp]);

  return !collectionUndefined ? (
    <AppResponseView
      onReload={onRefresh}
      progressViewOffset={progressViewOffset}
      status={collection.reqStatus}
      style={styles.collectionContainer}>
      {!onceLike ? (
        <AppAlertModal
          iconName={'likeActive'}
          visible={onceLikeShow}
          onDismiss={onceLikeOnDismiss}
          title={t('home:likeOnceTitle')}
          description={t('home:likeOnceDescription')}
          secondaryButtonText={t('home:likeOnceButton')}
          secondaryButtonOnPress={onceLikeOnDismiss}
        />
      ) : null}
      <Animated.View pointerEvents={'box-none'} style={[styles.collectionHeader, scrollStyle]}>
        <AppCollectionHeader
          navigation={navigation}
          route={route}
          mintingAvailable={mintingAvailable}
          onFinish={onRefresh}
        />
      </Animated.View>
      <AppFloatingNotifButton
        show={newUpdate}
        label={t('collection:newUpdates')}
        onPress={onRefresh}
        style={{ top: headerHeight + hp('3%') }}
        onClose={onUpdateClose}
      />
      <AppCollectionBody
        collectionHeaderHeight={totalHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        mintedItemsScreen={MintedItemsScreen}
        activityScreen={ActivityScreen}
        momentScreen={MomentScreen}
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
      <AppCollectionMintButton
        collection={collection}
        mintingAvailable={mintingAvailable}
        navigation={navigation}
        route={route}
      />
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
