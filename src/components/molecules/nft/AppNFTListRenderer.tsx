import { View, FlatList } from 'react-native';
import React from 'react';
import AppNFTRenderer from './AppNFTRenderer';
import AppPaginationIndicator from '../../atoms/pagination/AppPaginationIndicator';
import { hp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppNFTListRedererProps {
  width: number;
  itemWidth: number;
}

export default function AppNFTListRenderer({
  width,
  itemWidth,
}: AppNFTListRedererProps) {
  const insets = useSafeAreaInsets();

  return (
    <View>
      <FlatList
        data={[0, 0, 0]}
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
        pagingEnabled
      />
      <View
        style={{
          height: hp('1%', insets),
          marginTop: hp('0.5%', insets),
        }}>
        <AppPaginationIndicator length={2} active={1} />
      </View>
    </View>
  );
}
