import { View, FlatList } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import AppPortraitOverlayBox from 'enevti-app/components/molecules/AppPortraitOverlayBox';
import { useTranslation } from 'react-i18next';
import { Divider } from 'react-native-paper';
import { Moments } from 'enevti-app/types/core/service/feed';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import AppActivityIndicator from '../atoms/loading/AppActivityIndicator';

const center = 'center';

interface AppRecentMomentsProps {
  moments?: Moments;
  isUndefined?: boolean;
}

export default React.memo(
  function AppRecentMoments({ moments, isUndefined }: AppRecentMomentsProps) {
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

    return !isUndefined ? (
      moments && moments.length > 0 ? (
        <View style={{ height: hp('32.75%', insets) }}>
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
      )
    ) : (
      <View style={{ height: hp('32.75%', insets), justifyContent: center }}>
        <AppActivityIndicator animating />
      </View>
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
