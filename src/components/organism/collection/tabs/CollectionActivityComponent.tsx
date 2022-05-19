import React from 'react';
import { Platform, RefreshControl, StyleSheet, FlatList, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import useDimension from 'enevti-app/utils/hook/useDimension';
import AppListItem, { LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE } from 'enevti-app/components/molecules/list/AppListItem';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { parseAmount } from 'enevti-app/utils/format/amount';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import { parsePersonaLabel } from 'enevti-app/service/enevti/persona';
import { MINT_BUTTON_HEIGHT } from 'enevti-app/components/organism/collection/AppCollectionMintButton';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import AppActivityIcon from 'enevti-app/components/molecules/activity/AppActivityIcon';

const COLLECTION_ACTIVITY_ITEM_HEIGHT = 9;
const AnimatedFlatList = Animated.createAnimatedComponent<any>(FlatList);

interface CollectionActivityComponentProps {
  collection: Collection;
  onScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  mintingAvailable?: boolean;
}

function Component(
  {
    collection,
    onScroll,
    collectionHeaderHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    mintingAvailable,
  }: CollectionActivityComponentProps,
  ref: any,
) {
  const { hp, wp } = useDimension();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

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

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const renderItem = React.useCallback(
    ({ item }: { item: Collection['activity'][0] }) => (
      <AppListItem
        style={styles.collectionItem}
        leftContent={
          item.nfts.length ? (
            <AppNFTRenderer nft={item.nfts[0]} width={wp('13%')} style={styles.nftRenderer} />
          ) : (
            <AppActivityIcon activityName={item.name} />
          )
        }
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
        <AppTextHeading3 numberOfLines={1}>
          {item.nfts.length ? `${item.nfts[0].symbol}#${item.nfts[0].serial}` : collection.symbol}
        </AppTextHeading3>
        <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
          {t('collection:activityName', {
            name: item.name,
            address: parsePersonaLabel(item.to),
          })}
        </AppTextBody4>
      </AppListItem>
    ),
    [
      styles.collectionItem,
      styles.collectionRightContent,
      styles.collectionRightText,
      styles.nftRenderer,
      theme.colors.placeholder,
      collection.symbol,
      t,
      wp,
    ],
  );

  const keyExtractor = React.useCallback((item: Collection['activity'][0]) => item.transaction, []);

  const getItemLayout = React.useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const listFooter = React.useMemo(
    () => (mintingAvailable ? <View style={{ height: hp(MINT_BUTTON_HEIGHT) }} /> : undefined),
    [hp, mintingAvailable],
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
      keyExtractor={keyExtractor}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      data={collection.activity}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={21}
      ListFooterComponent={listFooter}
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
      paddingTop: hp(TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight:
        hp(100) + collectionHeaderHeight - hp(HEADER_HEIGHT_PERCENTAGE) - (Platform.OS === 'ios' ? insets.top : 0),
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
    nftRenderer: {
      width: wp('13%'),
      marginRight: wp('2%'),
      alignSelf: 'center',
      borderRadius: wp('13%'),
      overflow: 'hidden',
    },
  });

const CollectionActivityComponent = React.forwardRef(Component);
export default CollectionActivityComponent;
