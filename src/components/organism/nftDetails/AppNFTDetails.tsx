import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, StyleSheet, View } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { AppAsyncThunk } from 'enevti-app/types/store/AppAsyncThunk';
import {
  isNFTDetailsUndefined,
  selectNFTDetailsView,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import NFTActivityComponent from './tabs/NFTActivityComponent';
import {
  loadNFTDetails,
  unloadNFTDetails,
} from 'enevti-app/store/middleware/thunk/ui/view/nftDetails';

interface AppNFTDetailsProps {
  id: string;
  onScrollWorklet: (val: number) => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppNFTDetails({
  id,
  onScrollWorklet,
  navigation,
}: AppNFTDetailsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hp } = useDimension();
  const insets = useSafeAreaInsets();
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE) + insets.top;
  const styles = React.useMemo(() => makeStyles(), []);

  const nftDetails = useSelector(selectNFTDetailsView);
  const nftDetailsUndefined = useSelector(isNFTDetailsUndefined);

  const totalHeaderHeight = React.useMemo(
    () => hp(NFT_DETAILS_HEADER_VIEW_HEIGHT),
    [hp],
  );

  const [activityMounted, setActivityMounted] = React.useState<boolean>(false);

  const activityRef = useAnimatedRef<FlatList>();

  const headerCollapsed = useSharedValue(true);
  const rawScrollY = useSharedValue(0);
  const tabScroll = useSharedValue(0);

  const onNFTDetailsScreenLoaded = React.useCallback(
    (reload: boolean = false) => dispatch(loadNFTDetails({ id, reload })),
    [id, dispatch],
  ) as AppAsyncThunk;

  const onRefresh = React.useCallback(() => {
    onNFTDetailsScreenLoaded(true);
    activityRef.current?.scrollToOffset({ offset: 1 });
    onScrollWorklet && onScrollWorklet(0);
  }, [onNFTDetailsScreenLoaded, activityRef, onScrollWorklet]);

  React.useEffect(() => {
    const promise = onNFTDetailsScreenLoaded();
    return function cleanup() {
      dispatch(unloadNFTDetails());
      promise.abort();
    };
  }, [dispatch, onNFTDetailsScreenLoaded]);

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

  const collectionActivityScrollHandler = useCustomAnimatedScrollHandler([]);

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
    () => (activityMounted ? true : false),
    [activityMounted],
  );

  const ActivityScreen = React.useCallback(
    () => (
      <NFTActivityComponent
        ref={activityRef}
        activities={nftDetails.activity}
        collectionHeaderHeight={totalHeaderHeight}
        scrollEnabled={scrollEnabled}
        onScroll={collectionActivityScrollHandler}
        onMounted={activityOnMounted}
        onRefresh={onRefresh}
      />
    ),
    [
      activityOnMounted,
      activityRef,
      nftDetails.activity,
      collectionActivityScrollHandler,
      onRefresh,
      scrollEnabled,
      totalHeaderHeight,
    ],
  );

  return !nftDetailsUndefined ? (
    <View style={styles.nftDetailsContainer}>
      <Animated.View
        pointerEvents={'box-none'}
        style={[styles.nftDetailsHeader, scrollStyle]}>
        <AppNFTDetailsHeader navigation={navigation} nft={nftDetails} />
      </Animated.View>
      {/* <AppCollectionBody
        collectionHeaderHeight={totalHeaderHeight}
        animatedTabBarStyle={animatedTabBarStyle}
        mintedItemsScreen={MintedItemsScreen}
        activityScreen={ActivityScreen}
      />
      <AppCollectionMintButton
        collection={collection}
        mintingAvailable={mintingAvailable}
      /> */}
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
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
  });
