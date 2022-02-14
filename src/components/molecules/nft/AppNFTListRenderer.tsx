import { View, FlatList } from 'react-native';
import React from 'react';
import AppNFTRenderer from './AppNFTRenderer';
import AppPaginationIndicator from '../../atoms/pagination/AppPaginationIndicator';
import { hp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const nfts = [0, 0, 0];

interface AppNFTListRedererProps {
  width: number;
  itemWidth: number;
}

export default function AppNFTListRenderer({
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

  return (
    <View>
      <FlatList
        data={nfts}
        renderItem={() => (
          <View style={{ width: width }}>
            <AppNFTRenderer />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        snapToAlignment={'start'}
        snapToInterval={itemWidth}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        disableIntervalMomentum
        pagingEnabled
      />
      <View
        style={{
          height: hp('1%', insets),
          marginTop: hp('0.5%', insets),
        }}>
        <AppPaginationIndicator length={nfts.length} active={currentPage} />
      </View>
    </View>
  );
}
