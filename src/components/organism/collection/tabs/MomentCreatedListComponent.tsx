import React from 'react';
import { Dimensions, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { MINT_BUTTON_HEIGHT } from 'enevti-app/components/organism/collection/AppCollectionMintButton';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { loadMoreMoment } from 'enevti-app/store/middleware/thunk/ui/view/collection';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import { selectCollectionView, setCollectionRender } from 'enevti-app/store/slices/ui/view/collection';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppMomentItem from '../../moment/AppMomentItem';
import { MomentBase } from 'enevti-app/types/core/chain/moment';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { StackNavigationProp } from '@react-navigation/stack';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<MomentBase>>(FlatGrid);

interface MomentCreatedListComponentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Collection'>;
  onScroll?: any;
  onMomentumScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  mintingAvailable?: boolean;
}

function Component(
  {
    navigation,
    route,
    onScroll,
    onMomentumScroll,
    collectionHeaderHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    mintingAvailable,
  }: MomentCreatedListComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const collection = useSelector((state: RootState) => selectCollectionView(state, route.key));

  useFocusEffect(
    React.useCallback(() => {
      if (!collection.render.moment) {
        dispatch(setCollectionRender({ key: route.key, value: { moment: true } }));
      }
    }, [collection.render.moment, dispatch, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(hp, wp, displayed, collectionHeaderHeight, insets),
    [hp, wp, displayed, collectionHeaderHeight, insets],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('0.583%'), [wp]);
  const itemDimension = React.useMemo(() => wp('30%'), [wp]);

  const progressViewOffset = React.useMemo(
    () => (Platform.OS === 'ios' ? 0 : hp(TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight),
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
      collection.render.moment ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [collection.render.moment, styles.loaderContainer],
  );

  const onMomentPress = React.useCallback(
    (index: number) => {
      navigation.push('Moment', { mode: 'collection', index, arg: route.key });
    },
    [navigation, route.key],
  );

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <AppMomentItem showLike width={32.75} moment={item} onPress={() => onMomentPress(index)} style={styles.moment} />
    ),
    [onMomentPress, styles.moment],
  );

  const keyExtractor = React.useCallback((item: Collection['moment'][0]) => item.id, []);

  const listFooter = React.useMemo(
    () => (
      <View>
        {collection.render.moment &&
        collection.momentPagination &&
        collection.momentPagination.version !== collection.moment.length &&
        collection.moment.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
        {mintingAvailable ? <View style={{ height: hp(MINT_BUTTON_HEIGHT) }} /> : null}
      </View>
    ),
    [collection.render.moment, collection.momentPagination, collection.moment.length, hp, mintingAvailable],
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
      data={collection.render.moment ? collection.moment : []}
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
        Dimensions.get('screen').height +
        collectionHeaderHeight -
        hp(HEADER_HEIGHT_PERCENTAGE) -
        insets.top -
        insets.bottom,
      display: displayed ? undefined : 'none',
    },
    collectionRightContent: {
      justifyContent: 'center',
      flex: 0.5,
    },
    collectionRightText: {
      textAlign: 'right',
    },
    nftRenderer: {
      width: wp('13%'),
      marginRight: wp('2%'),
      alignSelf: 'center',
      borderRadius: wp('13%'),
      overflow: 'hidden',
    },
    moment: {
      borderRadius: 0,
    },
  });

const MomentCreatedListComponent = React.forwardRef(Component);
export default MomentCreatedListComponent;
