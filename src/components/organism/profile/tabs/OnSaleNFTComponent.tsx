import React from 'react';
import { Platform, RefreshControl } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatGrid, FlatGridProps } from 'react-native-super-grid';
import { NFTBase } from '../../../../types/nft';
import { PROFILE_HEADER_HEIGHT_PERCENTAGE } from '../AppProfileHeader';
import { TOP_TABBAR_HEIGHT_PERCENTAGE } from '../../../atoms/view/AppTopTabBar';
import { hp, wp } from '../../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNFTRenderer from '../../../molecules/nft/AppNFTRenderer';
import { useDispatch } from 'react-redux';
import {
  hideModalLoader,
  showModalLoader,
} from '../../../../store/slices/ui/global/modalLoader';

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface OnSaleNFTComponentProps {
  data?: any;
  onScroll?: any;
  headerHeight?: any;
  onMounted?: () => void;
  onRefreshStart?: () => Promise<void>;
  onRefreshEnd?: () => Promise<void>;
  scrollEnabled?: boolean;
}

function Component(
  {
    data,
    onScroll,
    headerHeight,
    onMounted,
    onRefreshStart,
    onRefreshEnd,
    scrollEnabled,
  }: OnSaleNFTComponentProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const noDisplay = 'none';
  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const handleRefresh = async () => {
    dispatch(showModalLoader());
    setRefreshing(true);
    onRefreshStart && (await onRefreshStart());
    onRefreshEnd && (await onRefreshEnd());
    dispatch(hideModalLoader());
    if (mounted.current) {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    if (ref && ref.current) {
      mounted.current = true;
      setDisplayed(true);
      onMounted && onMounted();
    }
    return function cleanup() {
      mounted.current = false;
    };
  }, [ref, onMounted, refreshing, onRefreshEnd]);

  return (
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      scrollEnabled={refreshing ? false : scrollEnabled}
      scrollEventThrottle={16}
      contentContainerStyle={[
        {
          paddingTop:
            hp(
              PROFILE_HEADER_HEIGHT_PERCENTAGE + TOP_TABBAR_HEIGHT_PERCENTAGE,
              insets,
            ) + headerHeight,
        },
        { display: displayed ? undefined : noDisplay },
      ]}
      spacing={wp('0.5%', insets)}
      showsVerticalScrollIndicator={false}
      itemDimension={wp('30%', insets)}
      data={data}
      renderItem={({ item }) => (
        <AppNFTRenderer nft={item} width={wp('30%', insets)} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={handleRefresh}
          progressViewOffset={
            Platform.OS === 'ios'
              ? headerHeight
              : hp(
                  PROFILE_HEADER_HEIGHT_PERCENTAGE +
                    TOP_TABBAR_HEIGHT_PERCENTAGE,
                  insets,
                ) + headerHeight
          }
        />
      }
    />
  );
}

const OnSaleNFTComponent = React.forwardRef(Component);
export default OnSaleNFTComponent;
