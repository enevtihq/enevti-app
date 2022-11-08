import React from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import useDimension from 'enevti-app/utils/hook/useDimension';
import AppNFTCard from 'enevti-app/components/molecules/nft/AppNFTCard';
import { MINT_BUTTON_HEIGHT } from 'enevti-app/components/organism/collection/AppCollectionMintButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { loadMoreMinted } from 'enevti-app/store/middleware/thunk/ui/view/collection';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import {
  selectCollectionView,
  selectCollectionViewMinted,
  setCollectionRender,
} from 'enevti-app/store/slices/ui/view/collection';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface MintedItemsComponentProps {
  route: RouteProp<RootStackParamList, 'Collection'>;
  onScroll?: any;
  onMomentumScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  mintingAvailable?: boolean;
  navigation?: StackNavigationProp<RootStackParamList>;
}

function Component(
  {
    route,
    onScroll,
    onMomentumScroll,
    collectionHeaderHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    mintingAvailable,
    navigation,
  }: MintedItemsComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const collection = useSelector((state: RootState) => selectCollectionView(state, route.key));
  const nfts = useSelector((state: RootState) => selectCollectionViewMinted(state, route.key));

  useFocusEffect(
    React.useCallback(() => {
      if (!collection.render.minted) {
        dispatch(setCollectionRender({ key: route.key, value: { minted: true } }));
      }
    }, [collection.render.minted, dispatch, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(hp, displayed, collectionHeaderHeight, insets),
    [hp, displayed, collectionHeaderHeight, insets],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('1%'), [wp]);
  const itemDimension = React.useMemo(() => wp('48%'), [wp]);
  const progressViewOffset = React.useMemo(
    () => (Platform.OS === 'ios' ? 0 : hp(TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight),
    [collectionHeaderHeight, hp],
  );

  const listFooter = React.useMemo(
    () => (
      <View>
        {collection.render.minted &&
        collection.mintedPagination &&
        collection.mintedPagination.version !== nfts.length &&
        nfts.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
        {mintingAvailable ? <View style={{ height: hp(MINT_BUTTON_HEIGHT) }} /> : null}
      </View>
    ),
    [collection.render.minted, collection.mintedPagination, nfts.length, hp, mintingAvailable],
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefresh && onRefresh();
    if (mounted.current) {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} progressViewOffset={progressViewOffset} />,
    [handleRefresh, progressViewOffset],
  );

  const emptyComponent = React.useMemo(
    () =>
      collection.render.minted ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [collection.render.minted, styles.loaderContainer],
  );

  const renderItem = React.useCallback(
    ({ item }) => <AppNFTCard nft={item} width={itemDimension} navigation={navigation} />,
    [itemDimension, navigation],
  );

  React.useEffect(() => {
    if (ref && ref.current) {
      mounted.current = true;
      setDisplayed(true);
      onMounted && onMounted();
    }
    return function cleanup() {
      mounted.current = false;
    };
  }, [ref, onMounted, refreshing]);

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreMinted({ route, reload: true }));
  }, [dispatch, route]);

  return (
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      onMomentumScrollBegin={onMomentumScroll}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      spacing={spacing}
      showsVerticalScrollIndicator={false}
      itemDimension={itemDimension}
      data={collection.render.minted ? nfts : []}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={listFooter}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
    />
  );
}

const makeStyles = (
  hp: DimensionFunction,
  displayed: boolean,
  collectionHeaderHeight: number,
  insets: SafeAreaInsets,
) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    contentContainerStyle: {
      paddingTop: hp(TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight:
        hp(100) + collectionHeaderHeight - hp(HEADER_HEIGHT_PERCENTAGE) - (Platform.OS === 'ios' ? insets.top : 0),
      display: displayed ? undefined : 'none',
    },
  });

const MintedItemsComponent = React.forwardRef(Component);
export default MintedItemsComponent;
