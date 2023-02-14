import React from 'react';
import { Platform, RefreshControl, ScaledSize, StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from 'enevti-types/chain/nft';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/profile/AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, windowFullHeight, wp } from 'enevti-app/utils/layout/imageRatio';
import AppNFTCard from 'enevti-app/components/molecules/nft/AppNFTCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface OnSaleNFTComponentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  data?: any;
  onScroll?: any;
  onMomentumScroll?: any;
  headerHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  disableHeaderAnimation?: boolean;
}

function Component(
  {
    navigation,
    data,
    onScroll,
    onMomentumScroll,
    headerHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    disableHeaderAnimation = false,
  }: OnSaleNFTComponentProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const styles = React.useMemo(
    () => makeStyles(headerHeight, displayed, disableHeaderAnimation, insets, dimension),
    [headerHeight, displayed, disableHeaderAnimation, insets, dimension],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);
  const spacing = React.useMemo(() => wp('1%'), []);
  const itemDimension = React.useMemo(() => wp('48%'), []);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? headerHeight
        : hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE) + headerHeight,
    [headerHeight],
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
    ({ item }) => <AppNFTCard nft={item} width={itemDimension} navigation={navigation} />,
    [itemDimension, navigation],
  );

  const keyExtractor = React.useCallback((item: NFTBase) => item.id, []);

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
      onMomentumScrollBegin={onMomentumScroll}
      scrollEnabled={isScrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      spacing={spacing}
      showsVerticalScrollIndicator={false}
      itemDimension={itemDimension}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
    />
  );
}

const makeStyles = (
  headerHeight: number,
  displayed: boolean,
  disableHeaderAnimation: boolean,
  insets: SafeAreaInsets,
  dimension: ScaledSize,
) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingTop: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE) + headerHeight,
      minHeight:
        windowFullHeight(dimension, insets) +
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE) +
        (disableHeaderAnimation ? 0 : headerHeight),
      display: displayed ? undefined : 'none',
    },
  });

const OnSaleNFTComponent = React.forwardRef(Component);
export default OnSaleNFTComponent;
