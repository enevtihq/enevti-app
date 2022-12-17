import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppNFTDetailsHeader from 'enevti-app/components/organism/nftDetails/AppNFTDetailsHeader';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { NFT_DETAILS_HEADER_VIEW_HEIGHT } from 'enevti-app/components/organism/nftDetails/AppNFTDetailsHeader';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';
import {
  isNFTDetailsUndefined,
  isThereAnyNewNFTUpdates,
  selectNFTDetailsView,
  setNFTDetailsVersion,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import NFTActivityComponent from './tabs/NFTActivityComponent';
import { loadNFTDetails, unloadNFTDetails } from 'enevti-app/store/middleware/thunk/ui/view/nftDetails';
import AppNFTDetailsBody from './AppNFTDetailsBody';
import NFTSummaryComponent from './tabs/NFTSummaryComponent';
import { RootState } from 'enevti-app/store/state';
import { RouteProp } from '@react-navigation/native';
import { DimensionFunction } from 'enevti-app/utils/layout/imageRatio';
import { useTheme } from 'react-native-paper';
import AppResponseView from '../view/AppResponseView';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/app/network';
import { redudeNFTSecretDelivered } from 'enevti-app/store/middleware/thunk/socket/nftDetails/secretDelivered';
import { reduceNewNFTUpdates } from 'enevti-app/store/middleware/thunk/socket/nftDetails/newNFTUpdates';
import { useTranslation } from 'react-i18next';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';
import { reduceNewNFTLike } from 'enevti-app/store/middleware/thunk/socket/nftDetails/newLike';
import { getRedeemErrors } from './AppNFTDetailsRedeemBar';
import { reduceRedeem } from 'enevti-app/store/middleware/thunk/redeem';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import NFTMomentListComponent from './tabs/NFTMomentListComponent';

const noDisplay = 'none';
const visible = 1;
const notVisible = 0;

interface AppNFTDetailsProps {
  onScrollWorklet: (val: number) => void;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
}

export default function AppNFTDetails({ onScrollWorklet, navigation, route }: AppNFTDetailsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE) + insets.top;
  const styles = React.useMemo(() => makeStyles(hp, wp), [hp, wp]);

  const autoRedeemedRef = React.useRef<boolean>(false);
  const nftDetails = useSelector((state: RootState) => selectNFTDetailsView(state, route.key));
  const nftDetailsUndefined = useSelector((state: RootState) => isNFTDetailsUndefined(state, route.key));
  const newUpdate = useSelector((state: RootState) => isThereAnyNewNFTUpdates(state, route.key));
  const socket = React.useRef<Socket | undefined>();

  const onUpdateClose = React.useCallback(() => {
    dispatch(setNFTDetailsVersion({ key: route.key, value: Date.now() }));
  }, [dispatch, route.key]);

  const onCheckRouteAutoRedeem = React.useCallback(async () => {
    if (nftDetails.loaded && route.params.redeem === 'true' && !autoRedeemedRef.current) {
      autoRedeemedRef.current = true;
      const redeemErrors = await getRedeemErrors(nftDetails);
      if (redeemErrors[0]) {
        dispatch(showSnackbar({ mode: 'info', text: t('nftDetails:redeemFailed') }));
      } else {
        dispatch(reduceRedeem(nftDetails, navigation, route));
      }
    }
  }, [dispatch, navigation, nftDetails, route, t]);

  React.useEffect(() => {
    onCheckRouteAutoRedeem();
  }, [onCheckRouteAutoRedeem]);

  React.useEffect(() => {
    if (nftDetails.loaded && nftDetails.id) {
      const key = route.key;
      socket.current = appSocket(nftDetails.id);
      socket.current.on('newNFTUpdates', (payload: any) => dispatch(reduceNewNFTUpdates(payload, key)));
      socket.current.on('secretDelivered', (payload: any) => dispatch(redudeNFTSecretDelivered(payload, key)));
      socket.current.on('newLike', (payload: any) => dispatch(reduceNewNFTLike(payload, key)));
      return function cleanup() {
        socket.current?.disconnect();
      };
    }
  }, [nftDetails, dispatch, route.key]);

  const totalHeaderHeight = React.useMemo(() => hp(NFT_DETAILS_HEADER_VIEW_HEIGHT), [hp]);

  const [summaryMounted, setSummaryMounted] = React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);
  const [momentMounted, setMomentMounted] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, afterRefresh] = React.useState<boolean>(false);

  const summaryRef = useAnimatedRef<ScrollView>();
  const activityRef = useAnimatedRef<FlatList>();
  const momentRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const onNFTDetailsScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadNFTDetails({ route, reload })),
    [dispatch, route],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(async () => {
    afterRefresh(false); // ios after refresh fix
    summaryRef.current?.scrollTo({ x: 0, y: 0 });
    activityRef.current?.scrollToOffset({ offset: 0 });
    momentRef.current?.scrollToOffset({ offset: 0 });
    onScrollWorklet && onScrollWorklet(0);
    await onNFTDetailsScreenLoaded(true).unwrap();
    afterRefresh(true); // ios after refresh fix
  }, [onNFTDetailsScreenLoaded, summaryRef, activityRef, momentRef, onScrollWorklet]);

  React.useEffect(() => {
    const promise = onNFTDetailsScreenLoaded();
    return function cleanup() {
      dispatch(unloadNFTDetails(route.key));
      promise.abort();
    };
  }, [dispatch, onNFTDetailsScreenLoaded, route.key]);

  const summaryOnMounted = React.useCallback(() => setSummaryMounted(true), []);

  const momentOnMounted = React.useCallback(() => setMomentMounted(true), []);

  const activityOnMounted = React.useCallback(() => setActivityMounted(true), []);

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

  const nftSummaryScrollHandler = useCustomAnimatedScrollHandler([activityRef, momentRef]);
  const nftMomentScrollHandler = useCustomAnimatedScrollHandler([activityRef, summaryRef]);
  const nftActivityScrollHandler = useCustomAnimatedScrollHandler([summaryRef, momentRef]);

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
    () => (summaryMounted && activityMounted && momentMounted ? true : false),
    [summaryMounted, activityMounted, momentMounted],
  );

  const SummaryScreen = React.useCallback(
    () => (
      <NFTSummaryComponent
        navigation={navigation}
        ref={summaryRef}
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={nftSummaryScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={summaryOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      navigation,
      summaryOnMounted,
      summaryRef,
      onUpdateClose,
      route,
      nftSummaryScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
    ],
  );

  const ActivityScreen = React.useCallback(
    () => (
      <NFTActivityComponent
        ref={activityRef}
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={nftActivityScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={activityOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      activityOnMounted,
      onUpdateClose,
      activityRef,
      route,
      nftActivityScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
    ],
  );

  const MomentScreen = React.useCallback(
    () => (
      <NFTMomentListComponent
        ref={momentRef}
        navigation={navigation}
        route={route}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={nftMomentScrollHandler}
        onMomentumScroll={onUpdateClose}
        onMounted={momentOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      momentRef,
      navigation,
      route,
      totalHeaderHeight,
      scrollEnabled,
      nftMomentScrollHandler,
      onUpdateClose,
      momentOnMounted,
      onRefresh,
    ],
  );

  const progressViewOffset = React.useMemo(() => hp(HEADER_HEIGHT_PERCENTAGE), [hp]);

  return !nftDetailsUndefined ? (
    <AppResponseView
      onReload={onRefresh}
      progressViewOffset={progressViewOffset}
      status={nftDetails.reqStatus}
      style={styles.nftDetailsContainer}>
      <Animated.View pointerEvents={'box-none'} style={[styles.nftDetailsHeader, scrollStyle]}>
        <AppNFTDetailsHeader navigation={navigation} nft={nftDetails} />
      </Animated.View>
      <AppFloatingNotifButton
        show={newUpdate}
        label={t('nftDetails:newUpdates')}
        onPress={onRefresh}
        style={{ top: headerHeight + hp('2%') }}
        onClose={onUpdateClose}
      />
      <AppNFTDetailsBody
        collectionHeaderHeight={totalHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        activityScreen={ActivityScreen}
        summaryScreen={SummaryScreen}
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
    </AppResponseView>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = (hp: DimensionFunction, wp: DimensionFunction) =>
  StyleSheet.create({
    nftDetailsContainer: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    nftDetailsHeader: {
      position: 'absolute',
      zIndex: 2,
    },
    mountedIndicator: {
      position: 'absolute',
      top: hp(NFT_DETAILS_HEADER_VIEW_HEIGHT + 15),
      left: wp('48%'),
    },
  });
