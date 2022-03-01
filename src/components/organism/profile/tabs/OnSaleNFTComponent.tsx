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

const AnimatedFlatGrid =
  Animated.createAnimatedComponent<FlatGridProps<NFTBase>>(FlatGrid);

interface OnSaleNFTComponentProps {
  data?: any;
  onScroll?: any;
  headerHeight?: any;
  onMounted?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  {
    data,
    onScroll,
    headerHeight,
    onMounted,
    scrollEnabled,
  }: OnSaleNFTComponentProps,
  ref: any,
) {
  const insets = useSafeAreaInsets();
  const noDisplay = 'none';
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // async onSaleRefreshFunction Here
    setRefreshing(false);
  };

  React.useEffect(() => {
    if (ref && ref.current) {
      setDisplayed(true);
      onMounted && onMounted();
    }
  }, [ref, onMounted]);

  return (
    <AnimatedFlatGrid
      ref={ref}
      onScroll={onScroll}
      scrollEnabled={scrollEnabled}
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
          refreshing={refreshing}
          onRefresh={handleRefresh}
          progressViewOffset={
            Platform.OS === 'ios'
              ? headerHeight * 0.5
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
