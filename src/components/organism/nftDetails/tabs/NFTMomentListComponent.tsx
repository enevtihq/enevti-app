import React from 'react';
import { Platform, RefreshControl, ScaledSize, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { DimensionFunction, SafeAreaInsets, windowFullHeight } from 'enevti-app/utils/layout/imageRatio';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE } from '../AppNFTDetailsBody';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectNFTDetailsView, setNFTDetailsRender } from 'enevti-app/store/slices/ui/view/nftDetails';
import { RootState } from 'enevti-app/store/state';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { loadMoreMoment } from 'enevti-app/store/middleware/thunk/ui/view/nftDetails';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { MomentBase } from 'enevti-app/types/core/chain/moment';
import AppMomentItem from '../../moment/AppMomentItem';
import { StackNavigationProp } from '@react-navigation/stack';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<MomentBase>>(FlatGrid);

interface NFTMomentListComponentProps {
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
  navigation: StackNavigationProp<RootStackParamList>;
  onScroll?: any;
  onMomentumScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  {
    route,
    navigation,
    onScroll,
    onMomentumScroll,
    collectionHeaderHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
  }: NFTMomentListComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const nftDetails = useSelector((state: RootState) => selectNFTDetailsView(state, route.key));

  useFocusEffect(
    React.useCallback(() => {
      if (!nftDetails.render.moment) {
        dispatch(setNFTDetailsRender({ key: route.key, value: { moment: true } }));
      }
    }, [dispatch, nftDetails.render.moment, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(hp, wp, displayed, collectionHeaderHeight, insets, dimension),
    [hp, wp, displayed, collectionHeaderHeight, insets, dimension],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('0.583%'), [wp]);
  const itemDimension = React.useMemo(() => wp('30%'), [wp]);

  const progressViewOffset = React.useMemo(
    () => (Platform.OS === 'ios' ? 0 : hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight),
    [collectionHeaderHeight, hp],
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
      nftDetails.render.moment ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [nftDetails.render.moment, styles.loaderContainer],
  );

  const onMomentPress = React.useCallback(
    (index: number) => {
      navigation.push('Moment', { mode: 'nft', index, arg: route.key });
    },
    [navigation, route.key],
  );

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <AppMomentItem showLike width={32.75} moment={item} onPress={() => onMomentPress(index)} style={styles.moment} />
    ),
    [onMomentPress, styles.moment],
  );

  const keyExtractor = React.useCallback((item: NFT['moment'][0]) => item.id, []);

  const listFooter = React.useMemo(
    () => (
      <View>
        {nftDetails.render.moment &&
        nftDetails.momentPagination &&
        nftDetails.moment &&
        nftDetails.momentPagination.version !== nftDetails.moment.length &&
        nftDetails.moment.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
        <View style={{ height: hp(5) }} />
      </View>
    ),
    [nftDetails.render.moment, nftDetails.momentPagination, nftDetails.moment, hp],
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
    dispatch(loadMoreMoment({ route, reload: true }));
  }, [dispatch, route]);

  return (
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      onMomentumScrollBegin={onMomentumScroll}
      keyExtractor={keyExtractor}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      spacing={spacing}
      itemDimension={itemDimension}
      showsVerticalScrollIndicator={false}
      data={nftDetails.moment ? nftDetails.moment : []}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={listFooter}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
    />
  );
}

const makeStyles = (
  hp: DimensionFunction,
  wp: DimensionFunction,
  displayed: boolean,
  collectionHeaderHeight: number,
  insets: SafeAreaInsets,
  dimension: ScaledSize,
) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    contentContainerStyle: {
      paddingTop: hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight: windowFullHeight(dimension, insets) + collectionHeaderHeight - hp(HEADER_HEIGHT_PERCENTAGE),
      display: displayed ? undefined : 'none',
    },
    collectionRightContent: {
      justifyContent: 'center',
      flex: 0.5,
    },
    collectionRightText: {
      textAlign: 'right',
    },
    moment: {
      borderRadius: 0,
    },
  });

const NFTMomentListComponent = React.forwardRef(Component);
export default NFTMomentListComponent;
