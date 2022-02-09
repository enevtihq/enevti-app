import { View, FlatList } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading3 from '../atoms/text/AppTextHeading3';
import { hp, wp } from '../../utils/imageRatio';
import AppPortraitOverlayBox from '../molecules/AppPortraitOverlayBox';
import { useTranslation } from 'react-i18next';
import { Divider } from 'react-native-paper';

const dummyData = [
  {
    url: 'https://effigis.com/wp-content/uploads/2015/02/DigitalGlobe_QuickBird_60cm_8bit_RGB_DRA_Boulder_2005JUL04_8bits_sub_r_1.jpg',
    title: '@aldhosutra',
  },
  {
    url: 'https://unsplash.it/400/400?image=1',
    title: '@aldhosutra',
  },
  {
    url: 'https://unsplash.it/400/400?image=1',
    title: '@aldhosutra',
  },
  {
    url: 'https://unsplash.it/400/400?image=1',
    title: '@aldhosutra',
  },
  {
    url: 'https://unsplash.it/400/400?image=1',
    title: '@aldhosutra',
  },
  {
    url: 'https://unsplash.it/400/400?image=1',
    title: '@aldhosutra',
  },
];

export default function AppRecentMoments() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View>
      <View
        style={{
          paddingHorizontal: wp('5%', insets),
          marginBottom: hp('2%', insets),
        }}>
        <AppTextHeading3>{t('home:recentMoments')}</AppTextHeading3>
      </View>
      <FlatList
        horizontal
        data={dummyData}
        ListHeaderComponent={() => <View style={{ width: wp('5%', insets) }} />}
        ListFooterComponent={() => <View style={{ width: wp('3%', insets) }} />}
        renderItem={({ item }) => (
          <AppPortraitOverlayBox
            url={item.url}
            title={item.title}
            style={{ marginRight: wp('2%', insets) }}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={100}
        windowSize={7}
      />
      <Divider
        style={{
          marginHorizontal: wp('5%', insets),
          marginTop: hp('2%', insets),
        }}
      />
    </View>
  );
}
