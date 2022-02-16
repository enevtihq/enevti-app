import { View, FlatList } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading3 from '../atoms/text/AppTextHeading3';
import { hp, wp } from '../../utils/imageRatio';
import AppPortraitOverlayBox from '../molecules/AppPortraitOverlayBox';
import { useTranslation } from 'react-i18next';
import { Divider } from 'react-native-paper';
import { HomeMomentsResponse } from '../../types/service/homeFeedItem';
import { IPFStoURL } from '../../service/ipfs';

interface AppRecentMomentsProps {
  moments?: HomeMomentsResponse;
}

export default React.memo(
  function AppRecentMoments({ moments }: AppRecentMomentsProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const onMomentsPress = (id: string) => {
      console.log(id);
    };

    const renderItem = React.useCallback(
      ({ item }: any) => (
        <AppPortraitOverlayBox
          url={IPFStoURL(item.photo)}
          title={item.username}
          style={{ marginRight: wp('2%', insets) }}
          onPress={() => onMomentsPress(item.id)}
        />
      ),
      [insets],
    );

    const listHeaderComponent = React.useCallback(
      () => <View style={{ width: wp('5%', insets) }} />,
      [insets],
    );

    const listFooterComponent = React.useCallback(
      () => <View style={{ width: wp('3%', insets) }} />,
      [insets],
    );

    const keyExtractor = React.useCallback(item => item.id, []);

    const getItemLayout = React.useCallback(
      (_, index) => ({
        length: wp('27%', insets),
        offset: wp('27%', insets) * index,
        index,
      }),
      [insets],
    );

    return moments ? (
      <View>
        <View
          style={{
            paddingHorizontal: wp('5%', insets),
            marginVertical: hp('2%', insets),
          }}>
          <AppTextHeading3>{t('home:recentMoments')}</AppTextHeading3>
        </View>
        <FlatList
          horizontal
          data={moments}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={4}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={500}
          windowSize={7}
          getItemLayout={getItemLayout}
        />
        <Divider
          style={{
            marginHorizontal: wp('5%', insets),
            marginTop: hp('2%', insets),
            marginBottom: wp('5%', insets),
          }}
        />
      </View>
    ) : (
      <View style={{ marginBottom: wp('5%', insets) }} />
    );
  },
  (props, nextProps) => {
    if (props.moments === nextProps.moments) {
      return true;
    } else {
      return false;
    }
  },
);
