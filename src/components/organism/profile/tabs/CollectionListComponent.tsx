import React from 'react';
import { FlatList, FlatListProps, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/profile/AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CollectionBase } from 'enevti-app/types/core/chain/collection';
import AppListItem, { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFSImagetoURL } from 'enevti-app/service/ipfs';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { parseAmount } from 'enevti-app/utils/format/amount';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useTranslation } from 'react-i18next';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { loadMoreCollection } from 'enevti-app/store/middleware/thunk/ui/view/profile';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMyProfileView,
  selectMyProfileViewCollection,
  selectMyProfileViewRender,
  setMyProfileRender,
} from 'enevti-app/store/slices/ui/view/myProfile';
import {
  selectProfileView,
  selectProfileViewCollection,
  selectProfileViewRender,
  setProfileRender,
} from 'enevti-app/store/slices/ui/view/profile';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootState } from 'enevti-app/store/state';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { isMintingAvailable } from 'enevti-app/utils/collection';
import { TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTabBar';

const PROFILE_COLLECTION_ITEM_HEIGHT = 9;

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<CollectionBase>>(FlatList);

interface CollectionListComponentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Profile'>;
  onScroll?: any;
  onMomentumScroll?: any;
  headerHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  disableHeaderAnimation?: boolean;
  isMyProfile?: boolean;
  withFooterSpace?: boolean;
}

function Component(
  {
    navigation,
    route,
    onScroll,
    onMomentumScroll,
    headerHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    disableHeaderAnimation = false,
    isMyProfile = false,
    withFooterSpace = false,
  }: CollectionListComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const total = useSelector((state: RootState) =>
    isMyProfile
      ? selectMyProfileView(state).collectionPagination.version
      : selectProfileView(state, route.key).collectionPagination.version,
  );
  const data = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewCollection(state) : selectProfileViewCollection(state, route.key),
  );
  const render = useSelector((state: RootState) =>
    isMyProfile ? selectMyProfileViewRender(state) : selectProfileViewRender(state, route.key),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!render.collection) {
        isMyProfile
          ? dispatch(setMyProfileRender({ collection: true }))
          : dispatch(setProfileRender({ key: route.key, value: { collection: true } }));
      }
    }, [dispatch, isMyProfile, render.collection, route.key]),
  );

  const styles = React.useMemo(
    () => makeStyles(insets, headerHeight, displayed, disableHeaderAnimation),
    [insets, headerHeight, displayed, disableHeaderAnimation],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? headerHeight
        : hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + headerHeight,
    [headerHeight, insets],
  );
  const itemHeight = React.useMemo(
    () => hp(PROFILE_COLLECTION_ITEM_HEIGHT + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE, insets),
    [insets],
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
      render.collection ? (
        <AppMessageEmpty />
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      ),
    [render.collection, styles.loaderContainer],
  );

  const keyExtractor = React.useCallback((item: CollectionBase) => item.id, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const onCollectionClick = React.useCallback(
    id => () => {
      navigation.push('Collection', { arg: id, mode: 'id' });
    },
    [navigation],
  );

  const handleLoadMore = React.useCallback(() => {
    dispatch(loadMoreCollection({ route, isMyProfile, reload: true }));
  }, [dispatch, route, isMyProfile]);

  const footerComponent = React.useMemo(
    () => (
      <View style={{ marginBottom: withFooterSpace ? hp(TABBAR_HEIGHT_PERCENTAGE) : hp(0) }}>
        {render.collection && total !== data.length && data.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
      </View>
    ),
    [withFooterSpace, render.collection, total, data.length],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: CollectionBase }) => (
      <AppListItem
        onPress={onCollectionClick(item.id)}
        style={styles.collectionItem}
        leftContent={
          <View style={styles.collectionCoverContainer}>
            <AppNetworkImage url={IPFSImagetoURL(item.cover.cid, 's')} style={styles.collectionCover} />
          </View>
        }
        rightContent={
          <View style={styles.collectionRightContent}>
            <AppTextHeading4 numberOfLines={1} style={styles.collectionRightText}>
              {`${parseAmount(item.stat.floor.amount, true, 2)} `}
              <AppTextHeading5>{`$${item.stat.floor.currency}`}</AppTextHeading5>
            </AppTextHeading4>
            <AppTextBody5 style={[styles.collectionRightText, { color: theme.colors.placeholder }]} numberOfLines={1}>
              {item.stat.minted} Minted
            </AppTextBody5>
          </View>
        }>
        <AppTextHeading3 numberOfLines={1}>{item.name}</AppTextHeading3>
        {isMintingAvailable(item) ? (
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={2}>
            {t('collection:mintingAvailable')}
          </AppTextBody4>
        ) : null}
      </AppListItem>
    ),
    [
      styles.collectionCover,
      styles.collectionCoverContainer,
      styles.collectionItem,
      styles.collectionRightContent,
      styles.collectionRightText,
      theme.colors.placeholder,
      onCollectionClick,
      t,
    ],
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

  return (
    <AnimatedFlatList
      ref={ref}
      onScroll={onScroll}
      onMomentumScrollBegin={onMomentumScroll}
      keyExtractor={keyExtractor}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      data={render.collection ? data : []}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={footerComponent}
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
  insets: SafeAreaInsets,
  headerHeight: number,
  displayed: boolean,
  disableHeaderAnimation: boolean,
) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    contentContainerStyle: {
      paddingTop: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + headerHeight,
      minHeight:
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + 100, insets) +
        (Platform.OS === 'android' ? insets.top : 0) +
        (disableHeaderAnimation ? 0 : headerHeight),
      display: displayed ? undefined : 'none',
    },
    collectionItem: {
      height: hp(PROFILE_COLLECTION_ITEM_HEIGHT, insets),
    },
    collectionRightContent: {
      justifyContent: 'center',
      flex: 0.5,
    },
    collectionRightText: {
      textAlign: 'right',
    },
    collectionCoverContainer: {
      borderRadius: wp('13%', insets) / 2,
      marginRight: wp('2%', insets),
      width: wp('13%', insets),
      height: wp('13%', insets),
      overflow: 'hidden',
      alignSelf: 'center',
    },
    collectionCover: {
      width: wp('13%', insets),
      height: wp('13%', insets),
    },
  });

const CollectionListComponent = React.forwardRef(Component);
export default CollectionListComponent;
