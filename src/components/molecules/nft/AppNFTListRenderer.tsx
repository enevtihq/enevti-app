import { View, FlatList } from 'react-native';
import React from 'react';
import AppNFTRenderer from './AppNFTRenderer';
import AppPaginationIndicator from '../../atoms/pagination/AppPaginationIndicator';
import { hp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NFTBase } from '../../../types/nft';

interface AppNFTListRedererProps {
  nft: NFTBase[];
  width: number;
  itemWidth: number;
}

export default React.memo(
  function AppNFTListRenderer({
    nft,
    width,
    itemWidth,
  }: AppNFTListRedererProps) {
    const insets = useSafeAreaInsets();
    const [currentPage, setCurrentPage] = React.useState<number>(0);

    const onScroll = (e: any) => {
      let pageNum = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
      if (pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    };

    const renderItem = React.useCallback(
      ({ item }: any) => (
        <View style={{ width: width }}>
          <AppNFTRenderer nft={item} width={width} />
        </View>
      ),
      [width],
    );

    const keyExtractor = React.useCallback(item => item.id, []);

    const getItemLayout = React.useCallback(
      (_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      }),
      [itemWidth],
    );

    return (
      <View>
        <FlatList
          data={nft}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          snapToAlignment={'start'}
          snapToInterval={itemWidth}
          decelerationRate={0.99}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          disableIntervalMomentum
          pagingEnabled
          removeClippedSubviews={true}
          initialNumToRender={1}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          getItemLayout={getItemLayout}
        />
        <View
          style={{
            height: hp('1%', insets),
            marginTop: hp('0.5%', insets),
          }}>
          <AppPaginationIndicator length={nft.length} active={currentPage} />
        </View>
      </View>
    );
  },
  (props, nextProps) => {
    if (props.width === nextProps.width) {
      return true;
    } else {
      return false;
    }
  },
);
