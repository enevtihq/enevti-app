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
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import { useTheme } from 'react-native-paper';
import AppResponseView from '../view/AppResponseView';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/network';
import { redudeNFTSecretDelivered } from 'enevti-app/store/middleware/thunk/socket/nftDetails/secretDelivered';
import { reduceNewNFTUpdates } from 'enevti-app/store/middleware/thunk/socket/nftDetails/newNFTUpdates';
import { useTranslation } from 'react-i18next';
import AppFloatingNotifButton from 'enevti-app/components/molecules/button/AppFloatingNotifButton';

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

  const nftDetails = useSelector((state: RootState) => selectNFTDetailsView(state, route.params.arg));
  const nftDetailsUndefined = useSelector((state: RootState) => isNFTDetailsUndefined(state, route.params.arg));
  const newUpdate = useSelector((state: RootState) => isThereAnyNewNFTUpdates(state, route.params.arg));
  const socket = React.useRef<Socket | undefined>();

  const onUpdateClose = React.useCallback(() => {
    dispatch(setNFTDetailsVersion({ key: route.params.arg, value: Date.now() }));
  }, [dispatch, route.params.arg]);

  React.useEffect(() => {
    if (nftDetails.loaded && nftDetails.id) {
      const key = route.params.arg;
      socket.current = appSocket(nftDetails.id);
      socket.current.on('newNFTUpdates', (payload: any) => dispatch(reduceNewNFTUpdates(payload, key)));
      socket.current.on('secretDelivered', (payload: any) => dispatch(redudeNFTSecretDelivered(payload, key)));
      return function cleanup() {
        socket.current?.disconnect();
      };
    }
  }, [nftDetails, dispatch, route.params.arg]);

  const totalHeaderHeight = React.useMemo(() => hp(NFT_DETAILS_HEADER_VIEW_HEIGHT), [hp]);

  const [summaryMounted, setSummaryMounted] = React.useState<boolean>(false);
  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);

  const summaryRef = useAnimatedRef<ScrollView>();
  const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const onNFTDetailsScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadNFTDetails({ routeParam: route.params, reload })),
    [dispatch, route.params],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(() => {
    onNFTDetailsScreenLoaded(true);
    summaryRef.current?.scrollTo({ x: 0, y: 0 });
    activityRef.current?.scrollToOffset({ offset: 0 });
    onScrollWorklet && onScrollWorklet(0);
  }, [onNFTDetailsScreenLoaded, summaryRef, activityRef, onScrollWorklet]);

  React.useEffect(() => {
    const promise = onNFTDetailsScreenLoaded();
    return function cleanup() {
      dispatch(unloadNFTDetails(route.params.arg));
      promise.abort();
    };
  }, [dispatch, onNFTDetailsScreenLoaded, route.params.arg]);

  const summaryOnMounted = React.useCallback(() => setSummaryMounted(true), []);

  const activityOnMounted = React.useCallback(() => setActivityMounted(true), []);

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

  const nftSummaryScrollHandler = useCustomAnimatedScrollHandler([activityRef]);
  const nftActivityScrollHandler = useCustomAnimatedScrollHandler([summaryRef]);

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
    () => (summaryMounted && activityMounted ? true : false),
    [summaryMounted, activityMounted],
  );

  const SummaryScreen = React.useCallback(
    () => (
      <NFTSummaryComponent
        navigation={navigation}
        ref={summaryRef}
        nft={nftDetails}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={nftSummaryScrollHandler}
        onMounted={summaryOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      navigation,
      summaryOnMounted,
      summaryRef,
      nftDetails,
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
        activities={nftDetails.activity}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={nftActivityScrollHandler}
        onMounted={activityOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      activityOnMounted,
      activityRef,
      nftDetails.activity,
      nftActivityScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
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
