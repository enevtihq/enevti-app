import React from 'react';
import { Platform, RefreshControl, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from '../../../../types/nft';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from '../../../atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, wp } from '../../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNFTCard from '../../../molecules/nft/AppNFTCard';

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface MintedItemsComponentProps {
  nfts: NFTBase[];
  onScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  {
    nfts,
    onScroll,
    collectionHeaderHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
  }: MintedItemsComponentProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const styles = React.useMemo(
    () => makeStyles(insets, displayed, collectionHeaderHeight),
    [insets, displayed, collectionHeaderHeight],
  );
  const isScrollEnabled = React.useMemo(
    () => (refreshing ? false : scrollEnabled),
    [refreshing, scrollEnabled],
  );
  const spacing = React.useMemo(() => wp('1%', insets), [insets]);
  const itemDimension = React.useMemo(() => wp('48%', insets), [insets]);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? 0
        : hp(TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + collectionHeaderHeight,
    [collectionHeaderHeight, insets],
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefresh && onRefresh();
    if (mounted.current) {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl
        refreshing={false}
        onRefresh={handleRefresh}
        progressViewOffset={progressViewOffset}
      />
    ),
    [handleRefresh, progressViewOffset],
  );

  const renderItem = React.useCallback(
    ({ item }) => <AppNFTCard nft={item} width={itemDimension} />,
    [itemDimension],
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
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      spacing={spacing}
      showsVerticalScrollIndicator={false}
      itemDimension={itemDimension}
      data={nfts}
      renderItem={renderItem}
      refreshControl={refreshControl}
    />
  );
}

const makeStyles = (
  insets: SafeAreaInsets,
  displayed: boolean,
  collectionHeaderHeight: number,
) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingTop:
        hp(TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + collectionHeaderHeight,
      minHeight: hp(100, insets) + collectionHeaderHeight,
      display: displayed ? undefined : 'none',
    },
  });

const MintedItemsComponent = React.forwardRef(Component);
export default MintedItemsComponent;
