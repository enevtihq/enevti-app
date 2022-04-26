import React from 'react';
import { Platform, RefreshControl, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from 'enevti-app/types/core/chain/nft';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/organism/profile/AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppTopTabBar';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppMessageEmpty from 'enevti-app/components/molecules/message/AppMessageEmpty';

const AnimatedFlatGrid = Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface OwnedNFTComponentProps {
  navigation: StackNavigationProp<RootStackParamList>;
  data?: any;
  onScroll?: any;
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
    headerHeight,
    onMounted,
    onRefresh,
    scrollEnabled,
    disableHeaderAnimation = false,
  }: OwnedNFTComponentProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const styles = React.useMemo(
    () => makeStyles(insets, headerHeight, displayed, disableHeaderAnimation),
    [insets, headerHeight, displayed, disableHeaderAnimation],
  );
  const isScrollEnabled = React.useMemo(
    () => (refreshing ? false : scrollEnabled),
    [refreshing, scrollEnabled],
  );
  const spacing = React.useMemo(() => wp('0.5%', insets), [insets]);
  const itemDimension = React.useMemo(() => wp('30%', insets), [insets]);
  const progressViewOffset = React.useMemo(
    () =>
      Platform.OS === 'ios'
        ? headerHeight
        : hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) +
          headerHeight,
    [headerHeight, insets],
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

  const emptyComponent = React.useMemo(() => <AppMessageEmpty />, []);

  const renderItem = React.useCallback(
    ({ item }) => <AppNFTRenderer nft={item} width={itemDimension} navigation={navigation} />,
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
      data={data}
      renderItem={renderItem}
      refreshControl={refreshControl}
      ListEmptyComponent={emptyComponent}
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
    contentContainerStyle: {
      paddingTop:
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE, insets) + headerHeight,
      minHeight:
        hp(PROFILE_HEADER_HEIGHT_PERCENTAGE + 100, insets) +
        (Platform.OS === 'android' ? insets.top : 0) +
        (disableHeaderAnimation ? 0 : headerHeight),
      display: displayed ? undefined : 'none',
    },
  });

const OwnedNFTComponent = React.forwardRef(Component);
export default OwnedNFTComponent;
