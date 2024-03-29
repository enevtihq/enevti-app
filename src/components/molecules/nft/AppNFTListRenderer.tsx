import { View, FlatList } from 'react-native';
import React from 'react';
import AppNFTRenderer from './AppNFTRenderer';
import AppPaginationIndicator from 'enevti-app/components/atoms/pagination/AppPaginationIndicator';
import { hp } from 'enevti-app/utils/layout/imageRatio';
import { NFTBase } from 'enevti-types/chain/nft';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { SizeCode } from 'enevti-types/service/api';

interface AppNFTListRedererProps {
  nft: NFTBase[];
  width: number;
  itemWidth: number;
  lazy?: boolean;
  navigation?: StackNavigationProp<RootStackParamList>;
  imageSize?: SizeCode;
  onPress?: () => void;
}

export default React.memo(
  function AppNFTListRenderer({
    nft,
    width,
    lazy,
    navigation,
    onPress,
    itemWidth,
    imageSize = 'og',
  }: AppNFTListRedererProps) {
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
          <AppNFTRenderer
            lazy={lazy}
            imageSize={imageSize}
            nft={item}
            width={width}
            navigation={navigation}
            onPress={onPress}
          />
        </View>
      ),
      [width, imageSize, navigation, onPress, lazy],
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
            height: hp('1%'),
            marginTop: hp('0.5%'),
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
