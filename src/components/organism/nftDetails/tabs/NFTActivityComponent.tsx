import React from 'react';
import { Platform, RefreshControl, StyleSheet, FlatList, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import useDimension from 'enevti-app/utils/hook/useDimension';
import AppListItem, { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { parseAmount } from 'enevti-app/utils/format/amount';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE } from '../AppNFTDetailsBody';
import AppActivityIcon from 'enevti-app/components/molecules/activity/AppActivityIcon';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'enevti-app/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectNFTDetailsView, selectNFTDetailsViewActivity } from 'enevti-app/store/slices/ui/view/nftDetails';
import { RootState } from 'enevti-app/store/state';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { loadMoreActivity } from 'enevti-app/store/middleware/thunk/ui/view/nftDetails';

const COLLECTION_ACTIVITY_ITEM_HEIGHT = 9;
const AnimatedFlatList = Animated.createAnimatedComponent<any>(FlatList);

interface NFTActivityComponentProps {
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
  onScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  { route, onScroll, collectionHeaderHeight, onMounted, onRefresh, scrollEnabled }: NFTActivityComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const nftDetails = useSelector((state: RootState) => selectNFTDetailsView(state, route.params.arg));
  const activities = useSelector((state: RootState) => selectNFTDetailsViewActivity(state, route.params.arg));

  const styles = React.useMemo(
    () => makeStyles(hp, wp, displayed, collectionHeaderHeight, insets),
    [hp, wp, displayed, collectionHeaderHeight, insets],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const itemHeight = React.useMemo(
    () => hp(COLLECTION_ACTIVITY_ITEM_HEIGHT + LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE),
    [hp],
  );
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

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const renderItem = React.useCallback(
    ({ item }: { item: NFT['activity'][0] }) => (
      <AppListItem
        style={styles.collectionItem}
        leftContent={<AppActivityIcon activityName={item.name} />}
        rightContent={
          <View style={styles.collectionRightContent}>
            <AppTextHeading4 numberOfLines={1} style={styles.collectionRightText}>
              {`${parseAmount(item.value.amount, true, 2)} `}
              <AppTextHeading5>{`$${item.value.currency}`}</AppTextHeading5>
            </AppTextHeading4>
            <AppTextBody5 style={[styles.collectionRightText, { color: theme.colors.placeholder }]} numberOfLines={1}>
              {moment(item.date).fromNow()}
            </AppTextBody5>
          </View>
        }>
        <AppTextHeading3 numberOfLines={1}>{item.name}</AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
          {t('collection:activityName', {
            name: t('collection:to'),
            address: parsePersonaLabel(item.to),
          })}
        </AppTextBody4>
      </AppListItem>
    ),
    [styles.collectionItem, styles.collectionRightContent, styles.collectionRightText, theme.colors.placeholder, t],
  );

  const keyExtractor = React.useCallback((item: NFT['activity'][0]) => item.transaction, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const listFooter = React.useMemo(
    () => (
      <View>
        {nftDetails.activityPagination &&
        nftDetails.activityPagination.version !== nftDetails.activity.length &&
        nftDetails.activity.length !== 0 ? (
          <AppActivityIndicator style={{ marginVertical: hp('3%') }} />
        ) : null}
        <View style={{ height: hp(5) }} />
      </View>
    ),
    [hp, nftDetails.activityPagination, nftDetails.activity.length],
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
    dispatch(loadMoreActivity({ routeParam: route.params, reload: true }));
  }, [dispatch, route.params]);

  return (
    <AnimatedFlatList
      ref={ref}
      onScroll={onScroll}
      keyExtractor={keyExtractor}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      data={activities}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
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
    contentContainerStyle: {
      paddingTop: hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight:
        hp(100) +
        collectionHeaderHeight -
        hp(HEADER_HEIGHT_PERCENTAGE) -
        (Platform.OS === 'ios' ? insets.top * 0.9 : 0),
      display: displayed ? undefined : 'none',
    },
    collectionItem: {
      height: hp(COLLECTION_ACTIVITY_ITEM_HEIGHT),
    },
    collectionRightContent: {
      justifyContent: 'center',
      flex: 0.5,
    },
    collectionRightText: {
      textAlign: 'right',
    },
  });

const NFTActivityComponent = React.forwardRef(Component);
export default NFTActivityComponent;
