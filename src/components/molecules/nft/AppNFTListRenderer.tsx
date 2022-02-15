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

    const onScrollEnd = (e: any) => {
      let pageNum = Math.floor(
        e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width,
      );
      if (pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    };

    const renderItem = ({ item }: any) => (
      <View style={{ width: width }}>
        <AppNFTRenderer nft={item} />
      </View>
    );

    return (
      <View>
        <FlatList
          data={nft}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          snapToAlignment={'start'}
          snapToInterval={itemWidth}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          disableIntervalMomentum
          pagingEnabled
          removeClippedSubviews={true}
          initialNumToRender={1}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
          })}
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
